export interface Link {
  text: string;
  className?: string;
  events?: {
    click?: () => void;
  };
}
