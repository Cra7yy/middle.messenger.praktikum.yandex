export interface Image {
  src: string;
  alt: string;
  text: string;
  events?: Record<string, (e: Event) => void>;
}
