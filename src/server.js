import express from 'express';
import { config, validateConfig } from './config.js';
import { resendClient } from './resend-client.js';
import {
  validateEmail,
  isRateLimited,
  logRejection,
  normalizeAddress,
} from './security.js';
import { processEmailForAgent, notifyOwnerOfRejectedEmail } from './agent.js';

const problems = validateConfig();
if (problems.length > 0) {
  console.error('Configuration errors:\n - ' + problems.join('\n - '));
  console.error('Copy .env.example to .env and fill in the values.');
  process.exit(1);
}

const resend = resendClient();
const app = express();

// Signature verification needs the RAW body — do not use express.json() here.
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  try {
    event = resend.webhooks.verify({
      payload: req.body.toString(),
      headers: {
        id: req.headers['svix-id'],
        timestamp: req.headers['svix-timestamp'],
        signature: req.headers['svix-signature'],
      },
      webhookSecret: config.webhookSecret,
    });
  } catch (err) {
    // Unverifiable payloads are the one case that gets a non-200: they are
    // not legitimate Resend events, so there is nothing to acknowledge.
    console.warn('Rejected webhook with invalid signature:', err.message);
    res.status(400).send('Invalid signature');
    return;
  }

  // Acknowledge immediately so Resend doesn't retry while we work; a 4xx/5xx
  // here would redeliver the event and double-process the email.
  res.status(200).send('OK');

  if (event.type !== 'email.received') return;

  try {
    await handleInboundEmail(event.data);
  } catch (err) {
    console.error('Error handling inbound email:', err);
  }
});

async function handleInboundEmail(eventData) {
  const sender = normalizeAddress(eventData.from);

  if (isRateLimited(sender)) {
    logRejection(eventData, 'rate limit exceeded');
    return;
  }

  // The webhook payload only carries metadata — fetch the full content.
  const { data: email, error } = await resend.emails.receiving.get(eventData.email_id);
  if (error) {
    console.error(`Failed to fetch email ${eventData.email_id}: ${error.message}`);
    return;
  }

  const verdict = validateEmail(eventData, email);
  if (!verdict.allowed) {
    logRejection(eventData, verdict.reason);
    await notifyOwnerOfRejectedEmail(eventData, verdict.reason);
    return;
  }

  await processEmailForAgent(eventData, email);
}

app.get('/', (_req, res) => {
  res.send('Agent Email Inbox - Ready');
});

app.listen(config.port, () => {
  console.log(`Agent email inbox listening on :${config.port}`);
  console.log(`Security level: ${config.securityLevel}`);
  if (config.securityLevel === 'strict') {
    console.log(`Allowed senders: ${config.allowedSenders.join(', ')}`);
  } else if (config.securityLevel === 'domain') {
    console.log(`Allowed domains: ${config.allowedDomains.join(', ')}`);
  }
});
