import 'dotenv/config';

function csv(value) {
  return (value || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

const SECURITY_LEVELS = ['strict', 'domain', 'filtered'];

export const config = {
  resendApiKey: process.env.RESEND_API_KEY,
  webhookSecret: process.env.RESEND_WEBHOOK_SECRET,
  securityLevel: (process.env.SECURITY_LEVEL || 'strict').toLowerCase(),
  allowedSenders: csv(process.env.ALLOWED_SENDERS),
  allowedDomains: csv(process.env.ALLOWED_DOMAINS),
  ownerEmail: (process.env.OWNER_EMAIL || '').toLowerCase(),
  agentFrom: process.env.AGENT_FROM || 'Agent <agent@example.com>',
  port: Number(process.env.PORT) || 3000,
  publicUrl: process.env.PUBLIC_URL,
};

export function validateConfig() {
  const problems = [];

  if (!config.resendApiKey) problems.push('RESEND_API_KEY is not set');
  if (!config.webhookSecret) problems.push('RESEND_WEBHOOK_SECRET is not set');

  if (!SECURITY_LEVELS.includes(config.securityLevel)) {
    problems.push(
      `SECURITY_LEVEL must be one of ${SECURITY_LEVELS.join(', ')} (got "${config.securityLevel}")`
    );
  }
  if (config.securityLevel === 'strict' && config.allowedSenders.length === 0) {
    problems.push('SECURITY_LEVEL=strict requires ALLOWED_SENDERS');
  }
  if (config.securityLevel === 'domain' && config.allowedDomains.length === 0) {
    problems.push('SECURITY_LEVEL=domain requires ALLOWED_DOMAINS');
  }

  return problems;
}
