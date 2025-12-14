import template from './LinksPage.hbs?raw';
import './LinksPage.scss';
import Block from '../../framework/Block';

export class LinksPage extends Block {
  constructor() {
    super('main', {});
  }

  render() {
    return template;
  }
}
