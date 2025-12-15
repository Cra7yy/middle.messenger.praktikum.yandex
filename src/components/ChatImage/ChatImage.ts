import template from './ChatImage.hbs?raw';
import './ChatImage.scss';
import Block from '../../framework/Block.ts';
import type { ChatImageType } from '../../type/chat.type.ts';

export class ChatImage extends Block {
  constructor(props: ChatImageType) {
    super('div', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
