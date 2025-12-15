export interface ButtonType {
  text?: string;
  type?: 'button' | 'submit';
  src?: string;
  alt?: string;
  id?: string;
  events?: { [key: string]: (e: Event) => void };
}
