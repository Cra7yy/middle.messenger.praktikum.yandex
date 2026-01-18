import type { User } from './user.type.ts'

export interface ChatImageType {
  imageSrc: string;
  altText: string;
  time: string;
}

export interface MessageType {
  messageText: string;
  time: string;
  src?: string;
}

export interface DateType {
  date: string;
}

export interface ChatInfo {
  id: string | number;
  title: string;
  avatar: string;
  unread_count: number;
  last_message: {
    user: User,
    time: string;
    content: string;
  }
}

export interface Message {
  chat_id: string | number;
  time: string;
  type: string;
  user_id: string | number;
  content: string;
  file?: {
    id: string | number;
    user_id: string | number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  }
}
