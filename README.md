# Agent Email Inbox

A secure email inbox for an AI agent, built on [Resend](https://resend.com) inbound webhooks. Emails sent to your agent's address are delivered to this server in real time, validated against a configurable security policy, and only then handed to the agent for processing and reply.

**Core principle: an agent's inbox receives untrusted input.** Anyone on the internet can email it, so every message is validated *before* any content reaches the agent.

## Architecture

```
Sender → Email → Resend (MX) → Webhook (POST /webhook) → This server
                                        ↓
                          1. Verify webhook signature
                          2. Rate-limit per sender
                          3. Fetch full email content
                          4. Validate against security policy
                                        ↓
                          Allowed → agent processes + replies
                          Rejected → logged + owner notified
```

## Project layout

| File | Purpose |
|------|---------|
| `src/server.js` | Express server; webhook signature verification and the processing pipeline |
| `src/security.js` | Security levels, sender validation, rate limiting, rejection audit log |
| `src/agent.js` | Agent integration point, reply sending, owner notifications |
| `src/config.js` | Environment configuration and validation |
| `scripts/register-webhook.js` | Registers the webhook with Resend via API and prints the signing secret |

## Setup

### 1. Install

```bash
npm install
cp .env.example .env
```

### 2. Resend account and API key

- Create an API key at <https://resend.com/api-keys>.
- **Existing account with other projects?** Create a *domain-scoped* key (Sending access → only the agent's domain) so a leaked key can't send from your other domains.
- Put the key in `.env` directly — **never paste API keys into chat** with an AI assistant. If a key was ever shared in chat, rotate it.

### 3. Receiving domain

**Option A — Resend-managed domain (fastest):** use your auto-generated address `<anything>@<your-id>.resend.app`. No DNS needed. Find it under Dashboard → Emails → Receiving.

**Option B — custom domain:** enable "Receiving" on the Domains page, then add an MX record. Use a **subdomain** (e.g. `agent.ekoprime.pl`) so you don't disrupt existing mail on the root domain:

| Setting | Value |
|---------|-------|
| Type | MX |
| Host | `agent.ekoprime.pl` (example) |
| Value | shown in the Resend dashboard |
| Priority | 10 (lowest number wins) |

MX changes can take up to 48h to propagate (usually much faster). Verify at [dns.email](https://dns.email).

### 4. Choose a security level

Set `SECURITY_LEVEL` in `.env`:

| Level | When to use | Trade-off |
|-------|-------------|-----------|
| `strict` (default) | Known, fixed set of senders | Maximum security, limited reach |
| `domain` | Anyone at trusted domain(s) | Flexible, whole domain can interact |
| `filtered` | Accept from anyone, reject unsafe patterns | Pattern matching is not foolproof — weakest option |

The default configuration is `strict` with `ALLOWED_SENDERS=k.rupniewski@ekoprime.pl`. Rejected emails are never processed; they are logged and a notification is sent to `OWNER_EMAIL`.

### 5. Expose the server and register the webhook

For local development you need a public HTTPS URL. Use a **persistent** URL (Tailscale Funnel, paid ngrok, or a real deployment) — ephemeral tunnel URLs break the webhook registration every restart:

```bash
# Tailscale Funnel (recommended)
tailscale funnel 3000

# or ngrok
ngrok http 3000
```

Then set `PUBLIC_URL` in `.env` to that URL and register the webhook:

```bash
npm run register-webhook
```

This prints `RESEND_WEBHOOK_SECRET` — **copy it into `.env` immediately**, it is only shown once.

### 6. Run

```bash
npm start        # or: npm run dev (auto-restart on changes)
```

### 7. Verify

1. `curl http://localhost:3000` → `Agent Email Inbox - Ready`
2. `curl https://<your-public-url>` → same response
3. Resend dashboard → Webhooks → status is active
4. Send a test email **from an allowlisted address** to the agent's address; the server logs `email_processed` and sends a reply
5. Send a test email **from a non-allowlisted address**; the server logs `email_rejected` and notifies the owner — this confirms the security policy actually rejects

For sending tests, Resend's addresses `delivered@resend.dev` (delivered) and `bounced@resend.dev` (hard bounce) are available.

## Connecting your agent

Replace `runAgent()` in `src/agent.js` with a call to your agent (Claude API, Agent SDK, etc.). Keep these rules:

- **Email content stays untrusted** even after sender validation. Pass it as clearly delimited data (e.g. inside `<untrusted_email>` tags), never spliced into the system prompt, and instruct the model to treat it as data, not instructions.
- **Scope capabilities to the minimum.** The email-handling agent should not have arbitrary code execution or broad credentials.
- **Replies are restricted**: `sendAgentReply()` refuses to send to addresses outside the configured trust policy.

## Security properties built into this server

| Practice | Where |
|----------|-------|
| Webhook signature verification (raw body) | `src/server.js` — rejects spoofed events with 400 |
| Sender allowlist / domain allowlist / content filter | `src/security.js` |
| Fail closed on unknown security level | `src/security.js` |
| Per-sender rate limiting (20/hour) | `src/security.js` |
| Audit log of every rejection | `src/security.js` |
| Owner notification on rejected email | `src/agent.js` |
| HTML stripped before reaching the agent | `src/agent.js` |
| Reply-address restriction | `src/agent.js` |
| 200 returned for rejected emails (no Resend retries, no info leak) | `src/server.js` |

## Environment variables

See `.env.example` for the full annotated list: `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `SECURITY_LEVEL`, `ALLOWED_SENDERS`, `ALLOWED_DOMAINS`, `OWNER_EMAIL`, `AGENT_FROM`, `PORT`, `PUBLIC_URL`.
