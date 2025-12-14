import template from './InputSign.hbs?raw';
import './InputSign.scss';
import Block from '../../framework/Block.ts';
import type { Input } from '../../type/input.type.ts';

export class InputSign extends Block {
  constructor(props: Input) {
    super('div', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
