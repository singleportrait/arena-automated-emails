# Daily Are.na Email Automation

Automatically sends a daily email with a randomly selected block from your Are.na channel. The app filters for blocks that were connected within the last 24 hours and sends a beautifully formatted HTML email.

## Features

- Fetches content from Are.na API
- Filters blocks by `base_type === 'Block'` and `connection.connected_at` within last 24 hours
- Randomly selects from filtered blocks
- Generates styled HTML email with block content
- Sends via Mailgun
- Runs automatically via GitHub Actions cron schedule
- All logs captured in GitHub Actions

## Setup

### 1. Get Are.na Access Token

1. Go to [Are.na OAuth Applications](https://dev.are.na/oauth/applications/new)
2. Create a new application
3. Copy your access token

### 2. Configure Mailgun

1. Sign in to [Mailgun](https://app.mailgun.com/)
2. Get your API key from Settings → API Keys
3. Note your domain (e.g., `mg.yourdomain.com`)

### 3. Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials in `.env`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Build TypeScript:
   ```bash
   npm run build
   ```

5. Run locally to test:
   ```bash
   npm run build
   npm start
   ```

   Or use `ts-node` for development (no build step needed):
   ```bash
   npm run dev
   ```

   **Note:** The app will automatically load your `.env` file when running locally. Make sure your `.env` file has all the required variables filled in.

### 4. GitHub Actions Setup

1. Push this repository to GitHub

2. Go to your repository → Settings → Secrets and variables → Actions

3. Add the following secrets:
   - `ARENA_CHANNEL_SLUG` - Your Are.na channel slug (e.g., `yuppie-dystopia`)
   - `ARENA_ACCESS_TOKEN` - Your Are.na API access token
   - `MAILGUN_API_KEY` - Your Mailgun API key
   - `MAILGUN_DOMAIN` - Your Mailgun domain (e.g., `mg.yourdomain.com`)
   - `EMAIL_FROM` - Sender email address
   - `EMAIL_TO` - Recipient email(s), comma-separated for multiple

4. The workflow will run automatically daily at 9:00 AM UTC

5. To test manually, go to Actions → Daily Email Automation → Run workflow

## Configuration

### Changing the Schedule

Edit `.github/workflows/daily-email.yml` and modify the cron expression:

```yaml
- cron: '0 9 * * *'  # 9:00 AM UTC daily
```

Cron format: `minute hour day month day-of-week`

Examples:
- `0 9 * * *` = 9:00 AM UTC daily
- `0 14 * * *` = 2:00 PM UTC (9:00 AM EST)
- `0 17 * * *` = 5:00 PM UTC (12:00 PM EST)

### Multiple Recipients

Set `EMAIL_TO` to a comma-separated list:
```
EMAIL_TO=user1@example.com,user2@example.com,user3@example.com
```

## Project Structure

```
arena-email-automations/
├── .github/
│   └── workflows/
│       └── daily-email.yml   # GitHub Actions workflow
├── src/
│   ├── index.ts              # Main entry point
│   ├── services/
│   │   ├── arenaService.ts   # Are.na API client
│   │   └── emailService.ts   # Mailgun integration
│   ├── templates/
│   │   └── emailTemplate.ts   # HTML email template
│   └── types/
│       └── arena.ts          # TypeScript types
├── .env.example              # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## How It Works

1. **Fetch**: Retrieves all channel contents from Are.na API
2. **Filter**: Filters blocks where:
   - `base_type === 'Block'`
   - `connection.connected_at` is within the last 24 hours
3. **Select**: Randomly selects one block from filtered results
4. **Generate**: Creates HTML email with block content
5. **Send**: Sends email via Mailgun to configured recipients

## Logs

All logs are automatically captured by GitHub Actions. View them in:
- Repository → Actions → Daily Email Automation → [Latest run] → Send daily email

Logs include:
- API fetch status
- Filtering results
- Selected block details
- Email delivery status

## Troubleshooting

### No blocks found

If you see "No matching blocks found", it means:
- No blocks with `base_type === 'Block'` in the channel, OR
- No blocks were connected within the last 24 hours

The script will exit gracefully without sending an email.

### Email not sending

Check:
1. Mailgun API key and domain are correct
2. Sender email is verified in Mailgun
3. Recipient email is valid
4. Check GitHub Actions logs for error details

### API errors

If Are.na API fails:
1. Verify your access token is correct
2. Check channel slug is correct
3. Ensure the channel is accessible with your token
4. Check GitHub Actions logs for detailed error messages

## License

ISC
