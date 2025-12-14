import template from './Error.hbs?raw';
import Block from '../../framework/Block.ts';
import type { ErrorPage } from '../../type/page.type.ts';
import { ComponentLink } from '../../components/ComponentLink/ComponentLink.ts';

class ClientErrorPage extends Block {
  constructor(props: ErrorPage) {
    super('main', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}

class ServerErrorPage extends Block {
  constructor(props: ErrorPage) {
    super('main', props);
  }

  render() {
    return this.compile(template, this.props);
  }
}

export const clientErrorPage = new ClientErrorPage({
  code: '404',
  title: 'Не туда попали',
  Link: new ComponentLink({
    url: '/chat',
    text: 'Назад к чатам'
  })
});
export const serverErrorPage = new ServerErrorPage({
  code: '500',
  title: 'Мы уже фиксим',
  Link: new ComponentLink({
    url: '/chat',
    text: 'Назад к чатам'
  })
});
