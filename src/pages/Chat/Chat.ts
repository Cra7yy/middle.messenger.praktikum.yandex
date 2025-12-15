import template from './Chat.hbs?raw';
import './Chat.scss';
import Block from '../../framework/Block.ts';
import type { Chat } from '../../type/page.type.ts';
import { ChatCard } from '../../components/ChatCard/ChatCard.ts';
import { ChatImage } from '../../components/ChatImage/ChatImage.ts';
import { Message } from '../../components/Message/Message.ts';
import { UserMessage } from '../../components/UserMessage/UserMessage.ts';
import { ChatDate } from '../../components/ChatDate/ChatDate.ts';
import { handleFocusOut, validateForm } from '../../utils/validations.ts';

class ChatPage extends Block {
  constructor(props: Chat) {
    super('main', props);
    }
  render() {
    return this.compile(template, this.props);
  }
}
export const chatPage = new ChatPage({
  error: '',
  ChatCard: new ChatCard({
    name: 'Иван Иванов',
    message: 'Привет, как дела?',
    time: '12:45',
    numberMessages: '3',
  }),
  MessageImage: new ChatImage({
    imageSrc: '/photo.png',
    altText: 'картинка',
    time: '12:46',
  }),
  ChatMessage: new Message({
    messageText: 'Привет! Все хорошо, спасибо!',
    time: '12:47',
  }),
  ChatUserMessage: new UserMessage({
    messageText: 'Рад это слышать!',
    time: '12:48',
    src: '/doblu_check.svg',
  }),
  Date: new ChatDate({
    date: '19 марта',
  }),
  events: {
    focusout: handleFocusOut,
    submit: (e: Event) => {
      e.preventDefault();
      const inputs = document.querySelectorAll('.chat__send-message-input');
      const isValid = validateForm(inputs as NodeListOf<HTMLInputElement>);

      if (isValid) {
        const input = inputs[0] as HTMLInputElement;
        console.log({ message: input.value });
      }
    }
  }
});
