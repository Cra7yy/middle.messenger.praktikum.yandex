import template from './InputProfile.hbs?raw';
import './InputProfile.scss';
import Block from '../../framework/Block.ts';
import type { Input } from '../../type/input.type.ts';

export class InputProfile extends Block {
  constructor(props: Input) {
    super('main', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
