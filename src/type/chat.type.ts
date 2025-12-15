export interface ChatType {
  name: string;
  message: string;
  time: string;
  numberMessages: string;
}

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
