import template from './ButtonProfile.hbs?raw';
import './ButtonProfile.scss';
import Block from '../../framework/Block.ts';
import type { ButtonType } from '../../type/button.type.ts';

export class ButtonProfile extends Block {
  constructor(props: ButtonType) {
    super('main', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
