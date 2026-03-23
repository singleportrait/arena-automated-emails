import axios, { AxiosInstance } from 'axios';
import { Block, Channel, ChannelContent } from '../types/arena';

export class ArenaService {
  private client: AxiosInstance;
  private channelSlug: string;

  constructor(accessToken: string, channelSlug: string) {
    this.channelSlug = channelSlug;
    this.client = axios.create({
      baseURL: 'https://api.are.na/v3',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Fetch channel metadata from Are.na API
   */
  async fetchChannel(): Promise<Channel> {
    try {
      console.log(`Fetching channel metadata: ${this.channelSlug}`);
      const response = await this.client.get<Channel>(
        `/channels/${this.channelSlug}`
      );
      console.log(`Channel title: "${response.data.title}"`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Are.na API error:', error.response?.status, error.response?.statusText);
        console.error('Error details:', error.response?.data);
        throw new Error(`Failed to fetch Are.na channel: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Fetch channel contents from Are.na API
   */
  async fetchChannelContents(): Promise<Block[]> {
    try {
      console.log(`Fetching contents from channel: ${this.channelSlug}`);
      const response = await this.client.get<ChannelContent>(
        `/channels/${this.channelSlug}/contents?sort=position_desc`
      );

      const blocks = response.data.data;
      console.log(`Fetched ${blocks.length} items from channel`);
      return blocks;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Are.na API error:', error.response?.status, error.response?.statusText);
        console.error('Error details:', error.response?.data);
        throw new Error(`Failed to fetch Are.na channel contents: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Filter blocks by base_type === 'Block' and connection.connected_at within last 24 hours
   */
  filterRecentBlocks(blocks: Block[]): Block[] {
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10 * 1000);
    // const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const filtered = blocks.filter((block) => {
      // Check base_type
      if (block.base_type !== 'Block') {
        return false;
      }

      // Check connection.connected_at exists and is within last 24 hours
      if (!block.connection || !block.connection.connected_at) {
        return false;
      }

      const connectedAt = new Date(block.connection.connected_at);
      // return connectedAt >= twentyFourHoursAgo && connectedAt <= now;
      return connectedAt >= tenSecondsAgo && connectedAt <= now;
    });

    console.log(
      `Filtered ${filtered.length} blocks from ${blocks.length} total (base_type=Block, connected within 24h)`,
    );
    return filtered;
  }

  /**
   * Randomly select a block from the filtered array
   */
  selectRandomBlock(blocks: Block[]): Block | null {
    if (blocks.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * blocks.length);
    const selected = blocks[randomIndex];
    console.log(`Selected block: ${selected.id} - "${selected.title || 'Untitled'}"`);
    return selected;
  }

  /**
   * Main method: fetch, filter, and select a random block
   */
  async getRandomRecentBlock(): Promise<Block | null> {
    try {
      const allBlocks = await this.fetchChannelContents();
      const recentBlocks = this.filterRecentBlocks(allBlocks);
      return this.selectRandomBlock(recentBlocks);
    } catch (error) {
      console.error('Error in getRandomRecentBlock:', error);
      throw error;
    }
  }
}
