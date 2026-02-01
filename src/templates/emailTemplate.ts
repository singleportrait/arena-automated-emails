import { Block, Channel } from '../types/arena';
import { getFormattedDate, calculateTimeAgo } from '../utils/dates';

export interface EmailTemplateData {
  block: Block;
  channel: Channel;
}


/**
 * Generate HTML email template with inline CSS
 * Combines hardcoded header/footer with dynamic Block content
 */
export function generateEmailTemplate(data: EmailTemplateData): string {
  const { block, channel } = data;
  const { id, title, description, content, image, source, connection } = block;

  const formattedDate = getFormattedDate(new Date());

  // Extract block data with fallbacks
  const blockTitle = title || null;
  const imageUrl = image?.large?.src || null;
  const sourceUrl = source?.url || null;
  const connectedByName = connection?.connected_by?.name || null;
  const blockUrl = `https://www.are.na/block/${id}`;
  const connectedByUrl = `https://www.are.na/${connection?.connected_by?.slug}`;
  const channelUrl = `https://www.are.na/${channel.owner.slug}/${channel.slug}`;
  const timeAgo = connection?.connected_at ? calculateTimeAgo(new Date(connection.connected_at)) : null;

  // Calculate image ratio
  const imageRatio = image?.large ? image.large.width / image.large.height : 1;

  // Remove 'www' from provider.name if it exists
  const providerName = source?.provider.name ? source.provider.name.replace('www.', '') : null;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Are.na</title>
</head>
<head>
  <style>
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

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 24px 24px;">
              ${imageUrl ? `
              <!-- Block Image -->
              <div style="margin-bottom: 24px; text-align: center;">
                <a href="${blockUrl}" style="display: block; text-decoration: none;">
                  <img src="${imageUrl}" alt="${title}" style="display: block; background-color: #d5d0f1; max-width: 100%; height: auto; max-height: 550px; aspect-ratio: ${imageRatio}; margin: 0 auto;" />
                </a>
              </div>
              ` : ''}

              ${content ? `
              <a href="${blockUrl}" class="rendered_html" style="display: block; margin: 0; margin-bottom: 24px; font-size: 14px; line-height: 1.5; border: 1px solid #222222; padding: 24px; text-align: center; aspect-ratio: 1/1; display: flex; justify-content: center; align-items: center; text-decoration: none; color: #222222;">
                ${content?.html}
              </a>
              ` : ''}

              <!-- Block Title -->
              ${blockTitle ? `
              <h2 style="margin: 0; margin-bottom: 10px; font-size: 24px; font-weight: 500; line-height: 1;">
                ${escapeHtml(blockTitle)}
              </h2>
              ` : ''}

              <!-- Block Description/Content -->
              ${description ? `
              <div class="rendered_html" style="margin: 0; margin-bottom: 10px; font-size: 16px; line-height: 1.5;">
                ${description?.html}
              </div>
              ` : ''}

              <!-- Source Link -->
              ${sourceUrl ? `
              <p style="margin: 0; margin-bottom: 10px; font-size: 14px; color: #777777;">
                Source:
                <a href="${sourceUrl}" style="color: #777777; text-decoration: underline; text-underline-offset: 2px;">${source?.title || escapeHtml(sourceUrl)}</a>
                ${providerName? `(${providerName})` : ''}
              </p>
              ` : ''}

              <!-- Connected By -->
              ${connectedByName ? `
              <p style="margin: 0; margin-bottom: 24px; font-size: 14px; color: #777777;">
                Connected by <a href="${connectedByUrl}" style="color: #777777; text-decoration: underline; text-underline-offset: 2px;">${escapeHtml(connectedByName)}</a>${timeAgo ? ` ${timeAgo}` : ''}.
              </p>
              ` : ''}
              <!-- View on Are.na Button -->
              <div style="text-align: center;">
                <a href="${blockUrl}" style="display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 12px 24px; background-color: #ffffff; color: #222222; text-decoration: none; border-radius: 20px; font-weight: 500; font-size: 16px;">
                  View on Are.na →
                </a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 16px 16px;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #eeeeee; border-radius: 20px; box-shadow: 0 2px 4px rgba(9, 7, 7, 0.1); color: #777777;">
          <!-- Footer -->
          <tr>
            <td style="padding: 24px; font-size: 12px; text-align: center; line-height: 1.5;">
              <p style="margin: 0; margin-bottom: 10px;">
                This email was automatically generated from your Are.na channel, finding 1 random block from the last 24 hours. This email is sent via a custom script in *this Github repository*. *Unsubscribe here*.
              </p>
              <p style="margin: 0;">
                ♡
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
