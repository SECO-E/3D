/**
 * Register the webhook endpoint with Resend via the API.
 *
 * Usage:
 *   PUBLIC_URL=https://your-public-url.example.com npm run register-webhook
 *
 * Prints the signing secret — put it in .env as RESEND_WEBHOOK_SECRET.
 * The secret is only returned at creation time, so save it immediately.
 */
import 'dotenv/config';
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const publicUrl = process.env.PUBLIC_URL;

if (!apiKey) {
  console.error('RESEND_API_KEY is not set.');
  process.exit(1);
}
if (!publicUrl || publicUrl.includes('example.com')) {
  console.error(
    'PUBLIC_URL is not set to a real URL. Set it to your HTTPS tunnel or deployment URL.'
  );
  process.exit(1);
}

const endpoint = `${publicUrl.replace(/\/$/, '')}/webhook`;

const resend = new Resend(apiKey);
const { data: result, error } = await resend.webhooks.create({
  endpoint,
  events: ['email.received'],
});

if (error) {
  console.error('Failed to create webhook:', error.message);
  process.exit(1);
}

console.log('Webhook created successfully.');
console.log(`  id:       ${result.id}`);
console.log(`  endpoint: ${endpoint}`);
console.log('');
console.log('Add the signing secret to your .env file NOW (it is only shown once):');
console.log(`  RESEND_WEBHOOK_SECRET=${result.signing_secret}`);
