import template from './ComponentLink.hbs?raw';
import './ComponentLink.scss';
import Block from '../../framework/Block.ts';
import type { Link } from '../../type/link.type.ts';

export class ComponentLink extends Block {
  constructor(props: Link) {
    super('main', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
