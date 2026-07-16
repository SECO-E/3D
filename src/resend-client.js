import { Resend } from 'resend';
import { config } from './config.js';

// Lazy singleton so importing a module never throws before the server has a
// chance to run validateConfig() and print a useful error.
let client;

export function resendClient() {
  if (!client) client = new Resend(config.resendApiKey);
  return client;
}
