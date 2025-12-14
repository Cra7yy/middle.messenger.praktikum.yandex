import template from './ImageProfile.hbs?raw';
import './ImageProfile.scss';
import Block from '../../framework/Block.ts';
import type { Image } from '../../type/image.type.ts';

export class ImageProfile extends Block {
  constructor(props: Image) {
    super('div', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
