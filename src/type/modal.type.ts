import Block from '../framework/Block';

export interface ModalType {
  title: string;
  textButton: string;
  Input: Block;
  isActive?: boolean;
  onSubmit?: () => void;
  events?: Record<string, (e: Event) => void>;
}
