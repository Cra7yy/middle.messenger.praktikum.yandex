import template from './ChatDate.hbs?raw';
import './ChatDate.scss';
import Block from '../../framework/Block.ts';
import type { DateType } from '../../type/chat.type.ts';

export class ChatDate extends Block {
  constructor(props: DateType) {
    super('div', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
