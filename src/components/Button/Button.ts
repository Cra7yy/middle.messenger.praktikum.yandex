import template from './Button.hbs?raw';
import './Button.scss';
import Block from '../../framework/Block.ts';
import type { ButtonType } from '../../type/button.type.ts';

export class Button extends Block {
  constructor(props: ButtonType) {
    super('main', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
