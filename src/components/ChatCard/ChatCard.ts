import template from './ChatCard.hbs?raw';
import './ChatCard.scss';
import Block from '../../framework/Block.ts';
import type { ChatType } from '../../type/chat.type.ts';

export class ChatCard extends Block {
  constructor(props: ChatType) {
    super('li', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
