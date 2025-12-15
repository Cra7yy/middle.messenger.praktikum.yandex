import template from './ProfileData.hbs?raw';
import './ProfileData.scss';
import Block from '../../framework/Block.ts';
import type { Profile } from '../../type/profile.type.ts';

export class ProfileData extends Block {
  constructor(props: Profile) {
    super('div', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
