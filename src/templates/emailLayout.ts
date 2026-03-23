import type { Channel } from '../types/arena';
import { getFormattedDate } from '../utils/dates';
import { escapeHtml } from '../utils/html';

export interface EmailLayoutOptions {
  channel: Channel;
  title?: string;
}

/**
 * Wraps inner table content (header + body rows) with the shared document structure,
 * outer tables, and styles. Use for all Are.na email templates.
 */
export function wrapEmailDocument(
  innerContent: string,
  options: EmailLayoutOptions,
): string {
  const { channel, title = 'Daily Are.na' } = options;

  const formattedDate = getFormattedDate(new Date());
  const channelUrl = `https://www.are.na/${channel.owner.slug}/${channel.slug}`;

  const documentStart = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<head>
  <style>
    .source-provider a {
      color: #777777 !important;
      text-decoration: none !important;
    }
    .rendered_html p {
      margin: 0;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 16px 16px 24px;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #eeeeee; border-radius: 20px; box-shadow: 0 2px 4px rgba(9, 7, 7, 0.1); color: #222222;">

          <!-- Header -->
            <tr>
              <td style="padding: 24px; text-align: center;">
                <p style="margin: 0; margin-bottom: 10px; font-size: 10px;">
                  ${formattedDate}
                </p>
                <a href="https://www.are.na" style="display: block; text-decoration: none; margin-bottom: 10px;">
                  <img src="https://i.imgur.com/bnHx6HX.png" alt="Are.na Logo" width="85" height="85" />
                </a>
                <h1 style="margin: 0; margin-bottom: 10px; font-size: 16px; font-weight: 500;">
                  Your daily Are.na digest from:
                </h1>
                <p style="margin: 0; font-size: 16px; font-weight: 500;">
                  <a href="${channelUrl}" style="color: #222222; text-decoration: underline; text-underline-offset: 3px;">${escapeHtml(channel.title)}</a>
                </p>
              </td>
            </tr>
`.trim();

  const documentEnd = `
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return documentStart + '\n\n' + innerContent.trim() + '\n\n' + documentEnd;
}
