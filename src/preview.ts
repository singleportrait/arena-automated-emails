import 'dotenv/config';
import { writeFileSync } from 'fs';
import { exec } from 'child_process';
import { ArenaService } from './services/arenaService';
import { generateEmailTemplate } from './templates/emailTemplate';

// Validate only Arena env vars (no Mailgun needed for preview)
const required = ['ARENA_CHANNEL_SLUG', 'ARENA_ACCESS_TOKEN'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const arenaService = new ArenaService(
    process.env.ARENA_ACCESS_TOKEN!,
    process.env.ARENA_CHANNEL_SLUG!
  );

  const block = await arenaService.getRandomRecentBlock();
  if (!block) {
    console.warn('No recent blocks found. Exiting.');
    process.exit(1);
  }

  const html = generateEmailTemplate({ block });
  writeFileSync('preview.html', html);

  const cmd =
    process.platform === 'darwin'
      ? 'open'
      : process.platform === 'win32'
        ? 'start'
        : 'xdg-open';
  exec(`${cmd} preview.html`);

  console.log(`Preview generated for: ${block.title || 'Untitled'}`);
}

main();
