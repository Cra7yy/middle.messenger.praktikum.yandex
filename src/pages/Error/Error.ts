import template from './Error.hbs?raw';
import './Error.scss';
import Block from '../../framework/Block.ts';
import { ComponentLink } from '../../components/ComponentLink/ComponentLink.ts';
import { ROUTES } from '../../const/paths.ts'
import Router from '../../utils/router.ts'

const router = new Router('#app');

export class NotFoundPage extends Block {
  constructor() {
    super('main', {
      code: '404',
      title: 'Не туда попали',
      Link: new ComponentLink({
        text: 'Назад к чатам',
        className: 'component-link',
        events: { click: () => {
          router.go(ROUTES.CHAT);
        }
      }})
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
