export interface Connection {
  id: number;
  connected_at: string; // ISO datetime string
  position: number;
  connected_by: {
    name: string;
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
  description?: TextContent;
  content?: TextContent;
  image?: {
    filename: string;
    content_type: string;
    file_size: number;
    alt_text?: string;
    large: {
      src: string;
    };
  } | null;
  source?: {
    url: string;
    title: string;
  } | null;
  base_type: string; // 'Block', 'Channel', etc.
  class: string;
  created_at: string;
  updated_at: string;
  connection?: Connection | null;
}

export interface ChannelContent {
  data: Block[];
}
