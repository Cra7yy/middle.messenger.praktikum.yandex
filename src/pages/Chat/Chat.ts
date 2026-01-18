import template from './Chat.hbs?raw';
import './Chat.scss';
import Block from '../../framework/Block.ts';
import { Message } from '../../components/Message/Message.ts';
import { UserMessage } from '../../components/UserMessage/UserMessage.ts';
import { ChatDate } from '../../components/ChatDate/ChatDate.ts';
import { Modal } from '../../components/Modal/Modal.ts';
import { InputSign } from '../../components/InputSign/InputSign.ts';
import { handleFocusOut, validateForm } from '../../utils/validations.ts';
import ChatController from '../../controllers/ChatController.ts';
import store, { StoreEvents } from '../../store/store.ts';
import type { ChatInfo, Message as MessageType } from '../../type/chat.type.ts';
import UserController from '../../controllers/UserController.ts'

export class ChatPage extends Block {
  private searchQuery: string = '';

  constructor() {
    super('main', {
      error: '',
      chatName: 'Выберите чат',
      ChatCard: [],
      Messages: [],
      Modal: new Modal({
        title: 'Добавить пользователя',
        textButton: 'Добавить',
        isActive: false,
        Input: new InputSign({
          label: 'Логин',
          type: 'text',
          id: 'user_login_modal',
          name: 'login',
          className: 'input-sign__error',
          error: ''
        })
      }),
      events: {
        input: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.matches('.chat__search-input')) {
            this.searchQuery = target.value;
            this.updateChats();

            setTimeout(() => {
              const input = this.getContent()?.querySelector('.chat__search-input') as HTMLInputElement;
              if (input) {
                input.focus();
                input.value = this.searchQuery;
                input.selectionStart = input.selectionEnd = this.searchQuery.length;
              }
            }, 0);
          }
        },
        click: async (e: Event) => {
          const target = e.target as HTMLElement;

          const chatCard = target.closest('.chat-card');
          if (chatCard) {
            const chatId = chatCard.getAttribute('data-chat-id');
            if (chatId) {
              ChatController.selectChat(chatId);
            }
            return;
          }

          const menuButton = target.closest('.chat__block-message-button');

          const createChatBtn = target.closest('.chat__action-create-chat');
          const deleteChatBtn = target.closest('.chat__action-delete-chat');
          const addUserBtn = target.closest('.chat__action-add-user');
          const deleteUserBtn = target.closest('.chat__action-delete-user');

          const modalBlock = this.children.Modal as Block;
          const modalOverlay = target.classList.contains('modal');
          const modalButton = target.closest('.modal__button');
          const userModal = document.querySelector('.chat__modal-user');

          if (menuButton) {
            userModal?.classList.toggle('chat__modal-active');
            return;
          }

          if (modalOverlay && modalBlock) {
            modalBlock.setProps({ isActive: false });
            return;
          }

          if (modalButton && modalBlock) {
            const currentTitle = modalBlock.props.title as string;
            const inputBlock = modalBlock.children.Input as Block;
            const loginInputElement = document.getElementById('user_login_modal') as HTMLInputElement | null;
            const inputValue = loginInputElement?.value.trim() || '';
            const selectedChat = store.getState().selectedChat;

            if (!inputValue) {
              inputBlock.setProps({ error: 'Введите значение' });
              return;
            }

            try {
              if (currentTitle === 'Создать чат') {
                 await ChatController.create(inputValue);
              } else if (currentTitle === 'Добавить пользователя') {
                 if (selectedChat) {
                    await ChatController.addUserToChat(selectedChat, inputValue);
                 }
              } else if (currentTitle === 'Удалить пользователя') {
                 if (selectedChat) {
                    await ChatController.deleteUserFromChat(Number(selectedChat), inputValue);
                 }
              }

              if (loginInputElement) loginInputElement.value = '';
              inputBlock.setProps({ error: '' });
              modalBlock.setProps({ isActive: false });

            } catch {
              inputBlock.setProps({ error: 'Ошибка или пользователь не найден' });
            }
            return;
          }

          if (createChatBtn) {
            if (modalBlock) {
              const inputBlock = modalBlock.children.Input as Block;
              inputBlock.setProps({ label: 'Название чата', error: '' });
              modalBlock.setProps({
                title: 'Создать чат',
                textButton: 'Создать',
                isActive: true
              });
            }
            userModal?.classList.remove('chat__modal-active');
            return;
          }

          if (deleteChatBtn) {
            const selectedChat = store.getState().selectedChat;
            if (!selectedChat) {
              alert('Сначала выберите чат');
            } else {
              if(confirm('Вы уверены, что хотите удалить этот чат?')) {
                  await ChatController.delete(Number(selectedChat));
              }
            }
            userModal?.classList.remove('chat__modal-active');
            return;
          }

          if (addUserBtn) {
            const selectedChat = store.getState().selectedChat;
            if (!selectedChat) {
              alert('Выберите чат');
            } else if (modalBlock) {
              const inputBlock = modalBlock.children.Input as Block;
              inputBlock.setProps({ label: 'Логин', error: '' });
              modalBlock.setProps({
                title: 'Добавить пользователя',
                textButton: 'Добавить',
                isActive: true
              });
            }
            userModal?.classList.remove('chat__modal-active');
            return;
          }

          if (deleteUserBtn) {
            const selectedChat = store.getState().selectedChat;
            if (!selectedChat) {
              alert('Сначала выберите чат');
            } else if (modalBlock) {
              const inputBlock = modalBlock.children.Input as Block;
              inputBlock.setProps({ label: 'Логин пользователя', error: '' });
              modalBlock.setProps({
                title: 'Удалить пользователя',
                textButton: 'Удалить',
                isActive: true
              });
            }
            userModal?.classList.remove('chat__modal-active');
            return;
          }

          if (userModal && !userModal.contains(target) && !menuButton && userModal.classList.contains('chat__modal-active')) {
            userModal.classList.remove('chat__modal-active');
          }
        },
        focusout: handleFocusOut,
        submit: (e: Event) => {
          console.log('aloha');
          e.preventDefault();
          const chatForm = (e.target as HTMLElement).closest('.chat__block-send-message');

          if (chatForm) {
            const input = chatForm.querySelector('.chat__send-message-input') as HTMLInputElement;
            const isValid = validateForm([input] as unknown as NodeListOf<HTMLInputElement>);

            if (isValid) {
              const message = input.value;
              const selectedChat = store.getState().selectedChat;

              if (selectedChat) {
                ChatController.sendMessage(Number(selectedChat), message);
                input.value = '';
              } else {
                console.log('Chat not selected');
              }
            }
          }
        }
      }
    });

    ChatController.fetchChats();

    store.on(StoreEvents.UPDATED, () => {
      this.updateChats();
      this.updateChatInfo();
      this.updateMessages();
    });
  }

  updateChats() {
    const state = store.getState();
    let chats = state.chats?.data || [];
    const { user } = store.getState();

    if (!user?.data) {
      UserController.fetchUser();
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      chats = chats.filter((chat) => chat.title.toLowerCase().includes(query));

      chats.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const aStarts = aTitle.startsWith(query);
        const bStarts = bTitle.startsWith(query);

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      });
    }

    if (chats.length === 0) {
      this.setProps({ ChatCard: '' });
      return;
    }

    const selectedChatId = state.selectedChat;

    const chatCardsHTML = chats.map((chat: ChatInfo) => {
      const isActive = selectedChatId === chat.id;
      const time = chat.last_message?.time ? new Date(chat.last_message.time).toLocaleTimeString().slice(0, 5) : '';

      return `
        <li class="chat-card ${isActive ? 'chat-card--active' : ''}" data-chat-id="${chat.id}">
          <div style="display: flex; overflow: hidden; width: 100%;">
            <div class="chat-card__avatar"></div>
            <div class="chat-card__user-info">
              <h4 class="chat-card__user-name">${chat.title}</h4>
              <p class="chat-card__user-message">${chat.last_message?.content || ''}</p>
            </div>
          </div>
          <div class="chat-card__message-info">
            <p class="chat-card__message-time">${time}</p>
            ${chat.unread_count > 0 ? `
              <div class="chat-card__block-unread-massages">
                <p class="chat-card__unread-massages">${chat.unread_count}</p>
              </div>
            ` : ''}
          </div>
        </li>
      `;
    }).join('');

    this.setProps({ ChatCard: chatCardsHTML });
  }

  updateChatInfo() {
    const state = store.getState();
    const selectedChatInfo = state.selectedChatInfo;

    if (selectedChatInfo) {
      this.setProps({ chatName: selectedChatInfo.title });
    }
  }

  updateMessages() {
    const state = store.getState();
    const selectedChat = state.selectedChat;
    const messages = selectedChat ? state.messages?.data?.[selectedChat] || [] : [];

    if (messages.length === 0) {
      this.setProps({ Messages: '' });
      return;
    }

    const messagesByDate = new Map<string, MessageType[]>();

    messages.forEach((msg: MessageType) => {
      const date = new Date(msg.time);
      const dateKey = date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      if (!messagesByDate.has(dateKey)) {
        messagesByDate.set(dateKey, []);
      }
      messagesByDate.get(dateKey)!.push(msg);
    });

    let messagesHTML = '';

    messagesByDate.forEach((msgs, dateKey) => {
      const dateComponent = new ChatDate({ date: dateKey });
      messagesHTML += dateComponent.getContent()?.outerHTML || '';

      msgs.forEach((msg: MessageType) => {
        const currentUser = state.user?.data;
        const isUserMessage = msg.user_id === currentUser?.id;

        let messageComponent;
        if (isUserMessage) {
          messageComponent = new UserMessage({
            messageText: msg.content,
            time: new Date(msg.time).toLocaleTimeString().slice(0, 5),
            src: '/doblu_check.svg'
          });
        } else {
          messageComponent = new Message({
            messageText: msg.content,
            time: new Date(msg.time).toLocaleTimeString().slice(0, 5)
          });
        }

        const alignClass = isUserMessage ? 'chat__message-wrapper--right' : 'chat__message-wrapper--left';
        messagesHTML += `<div class="chat__message-wrapper ${alignClass}">${messageComponent.getContent()?.outerHTML || ''}</div>`;
      });
    });

    this.setProps({ Messages: messagesHTML });

    setTimeout(() => {
      const contentBlock = this.getContent()?.querySelector('.chat__content');
      if (contentBlock) {
        contentBlock.scrollTop = contentBlock.scrollHeight;
      }
    }, 0);
  }

  render() {
    return this.compile(template, this.props);
  }
}
