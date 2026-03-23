import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { Block, Channel } from '../types/arena';
import { generateEmailTemplate } from '../templates/emailTemplate';
import { generateNoBlocksEmailTemplate } from '../templates/noBlocksEmailTemplate';

export interface EmailConfig {
  apiKey: string;
  domain: string;
  from: string;
  to: string | string[];
}

export class EmailService {
  private mailgunClient: ReturnType<Mailgun['client']>;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    const mailgun = new Mailgun(formData);
    this.mailgunClient = mailgun.client({
      username: 'api',
      key: config.apiKey,
    });
  }

  /**
   * Send email via Mailgun
   */
  async sendEmail(channel: Channel, block?: Block): Promise<void> {
    try {
      console.log('Selected block', block);
      const html = block
        ? generateEmailTemplate({ block, channel })
        : generateNoBlocksEmailTemplate({ channel });
      const recipients = Array.isArray(this.config.to)
        ? this.config.to
        : [this.config.to];

      console.log(
        `Preparing to send email to ${recipients.length} recipient(s)`,
      );

      const subject = block
        ? block.title || (block.type === 'Text' ? 'Text' : 'Untitled')
        : 'No new posts today :)';

      const messageData = {
        from: this.config.from,
        to: recipients,
        subject: `Daily Are.na: ${subject}`,
        html: html,
      };

      console.log(
        `Sending email via Mailgun (domain: ${this.config.domain})...`,
      );

      const response = await this.mailgunClient.messages.create(
        this.config.domain,
        messageData,
      );

      console.log(`Email sent successfully! Message ID: ${response.id}`);
      console.log(`Recipients: ${recipients.join(', ')}`);
    } catch (error) {
      console.error('Failed to send email via Mailgun:', error);
      if (error instanceof Error) {
        throw new Error(`Email delivery failed: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Send email to multiple recipients
   */
  async sendToMultipleRecipients(
    block: Block,
    channel: Channel,
    recipients: string[],
  ): Promise<void> {
    const originalTo = this.config.to;
    this.config.to = recipients;
    try {
      await this.sendEmail(channel, block);
    } finally {
      this.config.to = originalTo;
    }
  }
}
