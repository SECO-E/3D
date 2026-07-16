import { config } from './config.js';

/**
 * Sender validation for inbound email, per the configured SECURITY_LEVEL.
 *
 * An agent inbox receives untrusted input: anyone on the internet can email
 * it. Every email is validated here BEFORE any content reaches the agent.
 */

// Patterns that suggest an email is trying to steer or extract from the agent.
// Pattern matching is not foolproof — SECURITY_LEVEL=filtered is a weaker
// guarantee than strict/domain and should only be used when the inbox truly
// must accept mail from unknown senders.
const UNSAFE_CONTENT_PATTERNS = [
  /ignore (all |any )?(previous|prior|above) (instructions|context)/i,
  /disregard (your|the) (instructions|system prompt|rules)/i,
  /you are now\b/i,
  /new (system )?instructions:/i,
  /reveal (your|the) (system prompt|instructions|api key|secrets?)/i,
  /(api|secret|private) key/i,
  /\bexecute\b.*\b(command|script|shell|code)\b/i,
  /base64,[A-Za-z0-9+/=]{100,}/,
];

/** Extract a bare lowercase address from "Name <addr>" or "addr". */
export function normalizeAddress(from) {
  const match = String(from).match(/<([^>]+)>/);
  const addr = (match ? match[1] : String(from)).trim().toLowerCase();
  return addr;
}

function senderDomain(address) {
  const at = address.lastIndexOf('@');
  return at === -1 ? '' : address.slice(at + 1);
}

/**
 * Validate an inbound email against the configured security level.
 * Returns { allowed: boolean, reason: string }.
 */
export function validateEmail(eventData, emailContent) {
  const sender = normalizeAddress(eventData.from);

  if (!sender.includes('@')) {
    return { allowed: false, reason: `unparseable sender: ${eventData.from}` };
  }

  switch (config.securityLevel) {
    case 'strict': {
      if (!config.allowedSenders.includes(sender)) {
        return { allowed: false, reason: `sender not in allowlist: ${sender}` };
      }
      return { allowed: true, reason: 'sender in allowlist' };
    }

    case 'domain': {
      const domain = senderDomain(sender);
      if (!config.allowedDomains.includes(domain)) {
        return { allowed: false, reason: `sender domain not allowed: ${domain}` };
      }
      return { allowed: true, reason: 'sender domain allowed' };
    }

    case 'filtered': {
      const text = [eventData.subject, emailContent?.text, emailContent?.html]
        .filter(Boolean)
        .join('\n');
      const hit = UNSAFE_CONTENT_PATTERNS.find((p) => p.test(text));
      if (hit) {
        return { allowed: false, reason: `content matched unsafe pattern: ${hit}` };
      }
      return { allowed: true, reason: 'content passed filters' };
    }

    default:
      // Unknown level — fail closed.
      return { allowed: false, reason: `unknown security level: ${config.securityLevel}` };
  }
}

/**
 * Per-sender sliding-window rate limiter. In-memory: sufficient for a single
 * process; swap for Redis or similar if you run multiple instances.
 */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 20; // emails per sender per window

const senderHistory = new Map();

export function isRateLimited(sender) {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const history = (senderHistory.get(sender) || []).filter((t) => t > cutoff);

  if (history.length >= RATE_LIMIT_MAX) {
    senderHistory.set(sender, history);
    return true;
  }

  history.push(now);
  senderHistory.set(sender, history);
  return false;
}

/** Audit log for every rejected email. */
export function logRejection(eventData, reason) {
  console.warn(
    JSON.stringify({
      event: 'email_rejected',
      at: new Date().toISOString(),
      from: eventData.from,
      to: eventData.to,
      subject: eventData.subject,
      email_id: eventData.email_id,
      reason,
    })
  );
}
