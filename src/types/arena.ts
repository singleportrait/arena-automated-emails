export interface Connection {
  id: number;
  connected_at: string; // ISO datetime string
  position: number;
  connected_by: {
    name: string;
    slug: string;
  };
}

export interface TextContent {
  markdown: string;
  html: string;
  text: string;
}
export interface Block {
  id: number;
  title: string | null;
  type: string;
  description?: TextContent;
  content?: TextContent;
  image?: {
    filename: string;
    content_type: string;
    file_size: number;
    alt_text?: string;
    large: {
      src: string;
      width: number;
      height: number;
    };
  } | null;
  source?: {
    url: string;
    title: string;
    provider: {
      name: string;
    };
  } | null;
  base_type: string; // 'Block', 'Channel', etc.
  class: string;
  created_at: string;
  updated_at: string;
  connection: Connection;
}

export interface ChannelContent {
  data: Block[];
}

export interface Channel {
  id: number;
  title: string;
  slug: string;
  visibility: string;
  owner: {
    id: number;
    slug: string;
    name: string;
  };
}
