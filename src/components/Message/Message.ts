import template from './Message.hbs?raw';
import './Message.scss';
import Block from '../../framework/Block.ts';
import type { MessageType } from '../../type/chat.type.ts';

export class Message extends Block {
  constructor(props: MessageType) {
    super('div', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
