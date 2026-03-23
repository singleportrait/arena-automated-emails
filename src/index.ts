// Load environment variables from .env file (for local development)
// This is safe to use in production - it won't override existing env vars
import 'dotenv/config';

import { ArenaService } from './services/arenaService';
import { EmailService } from './services/emailService';

/**
 * Validate that all required environment variables are set
 */
function validateEnvironment(): void {
  const required = [
    'ARENA_CHANNEL_SLUG',
    'ARENA_ACCESS_TOKEN',
    'MAILGUN_API_KEY',
    'MAILGUN_DOMAIN',
    'EMAIL_FROM',
    'EMAIL_TO',
  ];

  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach((key) => console.error(`  - ${key}`));
    process.exit(1);
  }
}

/**
 * Parse EMAIL_TO - can be comma-separated string or single email
 */
function parseEmailRecipients(emailTo: string): string[] {
  return emailTo.split(',').map((email) => email.trim()).filter((email) => email.length > 0);
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  console.log('='.repeat(60));
  console.log('Daily Are.na Email Automation');
  console.log('='.repeat(60));
  console.log(`Started at: ${new Date().toISOString()}\n`);

  try {
    // Validate environment
    validateEnvironment();

    // Initialize services
    const arenaService = new ArenaService(
      process.env.ARENA_ACCESS_TOKEN!,
      process.env.ARENA_CHANNEL_SLUG!
    );

    const emailService = new EmailService({
      apiKey: process.env.MAILGUN_API_KEY!,
      domain: process.env.MAILGUN_DOMAIN!,
      from: process.env.EMAIL_FROM!,
      to: parseEmailRecipients(process.env.EMAIL_TO!),
    });

    // Fetch channel metadata and blocks
    console.log('Step 1: Fetching channel and blocks from Are.na...\n');
    const channel = await arenaService.fetchChannel();
    const selectedBlock = await arenaService.getRandomRecentBlock();

    if (!selectedBlock) {
      console.warn('⚠️  No matching blocks found (base_type=Block, connected within 24h)');
      console.warn('Skipping email send.');
      process.exit(0);
    }

    console.log(`\nStep 2: Sending email with selected block...\n`);
    await emailService.sendEmail(channel, selectedBlock);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Success! Email sent successfully.');
    console.log('='.repeat(60));
    process.exit(0);
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ Error occurred:');
    console.error('='.repeat(60));

    if (error instanceof Error) {
      console.error(error.message);
      if (error.stack) {
        console.error('\nStack trace:');
        console.error(error.stack);
      }
    } else {
      console.error('Unknown error:', error);
    }

    process.exit(1);
  }
}

// Run the script
main();
