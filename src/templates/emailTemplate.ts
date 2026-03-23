import { Block, Channel } from '../types/arena';
import { calculateTimeAgo } from '../utils/dates';
import { escapeHtml } from '../utils/html';
import { wrapEmailDocument } from './emailLayout';

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

  // Extract block data with fallbacks
  const blockTitle = title || null;
  const imageUrl = image?.large?.src || null;
  const sourceUrl = source?.url || null;
  const connectedByName = connection?.connected_by?.name || null;
  const blockUrl = `https://www.are.na/block/${id}`;
  const connectedByUrl = `https://www.are.na/${connection?.connected_by?.slug}`;
  const timeAgo = connection?.connected_at
    ? calculateTimeAgo(new Date(connection.connected_at))
    : null;

  // Calculate image ratio
  const imageRatio = image?.large ? image.large.width / image.large.height : 1;

  // Remove 'www' from provider.name if it exists
  const providerName = source?.provider.name
    ? source.provider.name.replace('www.', '')
    : null;

  const innerContent = `

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 24px 24px;">
              ${
                imageUrl
                  ? `
              <!-- Block Image -->
              <div style="margin-bottom: 24px; text-align: center;">
                <a href="${blockUrl}" style="display: block; text-decoration: none;">
                  <img src="${imageUrl}" alt="${title}" style="display: block; background-color: #d5d0f1; max-width: 100%; height: auto; max-height: 550px; aspect-ratio: ${imageRatio}; margin: 0 auto;" />
                </a>
              </div>
              `
                  : ''
              }

              ${
                content
                  ? `
              <a href="${blockUrl}" class="rendered_html" style="display: block; margin: 0; margin-bottom: 24px; font-size: 14px; line-height: 1.5; border: 1px solid #222222; padding: 24px; text-align: center; aspect-ratio: 1/1; display: flex; justify-content: center; align-items: center; text-decoration: none; color: #222222;">
                ${content?.html}
              </a>
              `
                  : ''
              }

              <!-- Block Title -->
              ${
                blockTitle
                  ? `
              <h2 style="margin: 0; margin-bottom: 10px; font-size: 24px; font-weight: 500; line-height: 1;">
                ${escapeHtml(blockTitle)}
              </h2>
              `
                  : ''
              }

              <!-- Block Description/Content -->
              ${
                description
                  ? `
              <div class="rendered_html" style="margin: 0; margin-bottom: 10px; font-size: 16px; line-height: 1.5;">
                ${description?.html}
              </div>
              `
                  : ''
              }

              <!-- Source Link -->
              ${
                sourceUrl
                  ? `
              <p style="margin: 0; margin-bottom: 10px; font-size: 14px; color: #777777;">
                Source:
                <a href="${sourceUrl}" style="color: #777777; text-decoration: underline; text-underline-offset: 2px;">${source?.title || escapeHtml(sourceUrl)}</a>
                ${providerName ? `<span class="source-provider">(${providerName})</span>` : ''}
              </p>
              `
                  : ''
              }

              <!-- Connected By -->
              ${
                connectedByName
                  ? `
              <p style="margin: 0; margin-bottom: 24px; font-size: 14px; color: #777777;">
                Connected by <a href="${connectedByUrl}" style="color: #777777; text-decoration: underline; text-underline-offset: 2px;">${escapeHtml(connectedByName)}</a>${timeAgo ? ` ${timeAgo}` : ''}.
              </p>
              `
                  : ''
              }
              <!-- View on Are.na Button -->
              <div style="text-align: center;">
                <a href="${blockUrl}" style="display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 12px 24px; background-color: #ffffff; color: #222222; text-decoration: none; border-radius: 20px; font-weight: 500; font-size: 16px;">
                  View on Are.na →
                </a>
              </div>
            </td>
          </tr>
`;

  return wrapEmailDocument(innerContent, { channel }).trim();
}
