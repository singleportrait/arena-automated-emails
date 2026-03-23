import { Channel } from '../types/arena';
import { wrapEmailDocument } from './emailLayout';

export interface EmailTemplateData {
  channel: Channel;
}

/**
 * Generate HTML email template with inline CSS
 * Combines hardcoded header/footer with no blocks content
 */
export function generateNoBlocksEmailTemplate(data: EmailTemplateData): string {
  const { channel } = data;
  const channelUrl = `https://www.are.na/${channel.owner.slug}/${channel.slug}`;

  const innerContent = `

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 24px 24px;">
              <div class="rendered_html" style="display: block; margin: 0; margin-bottom: 24px; font-size: 14px; line-height: 1.5; border: 1px dashed #222222; padding: 24px; text-align: center; aspect-ratio: 1/1; color: #222222;">
                No new posts today!
              </div>

              <!-- View Channel Button -->
              <div style="text-align: center;">
                <a href="${channelUrl}" style="display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 12px 24px; background-color: #ffffff; color: #222222; text-decoration: none; border-radius: 20px; font-weight: 500; font-size: 16px;">
                  View Channel →
                </a>
              </div>
            </td>
          </tr>
`;

  return wrapEmailDocument(innerContent, { channel }).trim();
}
