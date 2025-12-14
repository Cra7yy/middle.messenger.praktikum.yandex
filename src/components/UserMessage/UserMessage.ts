import template from './UserMessage.hbs?raw';
import './UserMessage.scss';
import Block from '../../framework/Block.ts';
import type { MessageType } from '../../type/chat.type.ts';

export class UserMessage extends Block {
  constructor(props: MessageType) {
    super('div', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
