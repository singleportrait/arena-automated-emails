import { Block } from '../types/arena';

export interface EmailTemplateData {
  block: Block;
}

/**
 * Generate HTML email template with inline CSS
 * Combines hardcoded header/footer with dynamic Block content
 */
export function generateEmailTemplate(data: EmailTemplateData): string {
  const { block } = data;
  const { id, title, description, content, image, source, connection } = block;

  // Extract block data with fallbacks
  const blockTitle = title || 'Untitled';
  const blockDescription = content || description || '';
  const imageUrl = image?.large?.src || null;
  const sourceUrl = source?.url || null;
  const connectedByName = connection?.connected_by?.name || null;
  const blockUrl = `https://www.are.na/block/${id}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Are.na</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; text-align: center; border-bottom: 1px solid #eeeeee;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #333333;">
                Daily Are.na
              </h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #666666;">
                A curated selection from your channel
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              ${imageUrl ? `
              <!-- Block Image -->
              <div style="margin-bottom: 30px; text-align: center;">
                <a href="${blockUrl}" style="display: inline-block; text-decoration: none;">
                  <img src="${imageUrl}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
                </a>
              </div>
              ` : ''}

              <!-- Block Title -->
              <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #333333; line-height: 1.3;">
                ${escapeHtml(blockTitle)}
              </h2>

              <!-- Connected By -->
              ${connectedByName ? `
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #666666;">
                Connected by ${escapeHtml(connectedByName)}
              </p>
              ` : ''}

              <!-- Block Description/Content -->
              ${blockDescription ? `
              <div style="margin-bottom: 30px; font-size: 16px; line-height: 1.6; color: #444444;">
                ${blockDescription?.html}
              </div>
              ` : ''}

              <!-- Source Link -->
              ${sourceUrl ? `
              <div style="margin-bottom: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 4px; border-left: 3px solid #4a90e2;">
                <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #666666; font-weight: 600;">
                  Source
                </p>
                <a href="${sourceUrl}" style="color: #4a90e2; text-decoration: none; font-size: 14px; word-break: break-all;">
                  ${source?.title || escapeHtml(sourceUrl)}
                </a>
              </div>
              ` : ''}

              <!-- View on Are.na Button -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="${blockUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4a90e2; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 14px;">
                  View on Are.na →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #eeeeee; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; font-size: 12px; color: #999999; text-align: center; line-height: 1.5;">
                This email was automatically generated from your Are.na channel.<br>
                You're receiving this because you subscribed to daily updates.
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
