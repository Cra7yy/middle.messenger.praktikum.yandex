import { ChatApi } from '../api/chat.api';
import store from '../store/store';
import { UserApi } from '../api/user.api';

class ChatController {
  private api = new ChatApi();
  private userApi = new UserApi();
  private sockets: Map<number, WebSocket> = new Map();
  private pingIntervals: Map<number, number> = new Map();

  async fetchChats() {
    store.set('chats.isLoading', true);

    try {
      const response = await this.api.read();
      store.set('chats.data', JSON.parse(response.response));
    } catch (e) {
      store.set('chats.error', e);
      console.error(e);
    } finally {
      store.set('chats.isLoading', false);
    }
  }

  async create(title: string) {
    try {
      const response = await this.api.create(title);
      try {
        const data = JSON.parse(response.response);
        if (data && data.id) {
          await this.fetchChats();
          this.selectChat(data.id);
        }
      } catch {
        await this.fetchChats();
      }
    } catch (e) {
      console.error(e);
    }
  }

  selectChat(id: string | number) {
    const numId = Number(id);
    store.set('selectedChat', numId);

    const chats = store.getState().chats?.data || [];
    const selectedChatInfo = chats.find((chat) => chat.id === numId);
    if (selectedChatInfo) {
      store.set('selectedChatInfo', selectedChatInfo);
    }

    this.connectToChat(numId);
  }

  async connectToChat(chatId: number) {
    console.log(chatId)
    const existingSocket = this.sockets.get(chatId);
    if (existingSocket && existingSocket.readyState === WebSocket.OPEN) {
      existingSocket.close();
    }

    const existingInterval = this.pingIntervals.get(chatId);
    if (existingInterval) {
      clearInterval(existingInterval);
      this.pingIntervals.delete(chatId);
    }

    try {
      const userId = store.getState().user?.data?.id;
      console.log(store.getState())

      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const token = await this.api.getToken(chatId);

      if (!token) {
        console.error('Failed to get token');
        return;
      }

      console.log('Connecting to WebSocket:', { userId, chatId, tokenLength: token.length });

      const socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);

      socket.addEventListener('open', () => {
        console.log('WebSocket connection opened for chat', chatId);

        socket.send(JSON.stringify({
          content: '0',
          type: 'get old',
        }));

        const pingInterval = window.setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
              type: 'ping',
            }));
          }
        }, 30000);

        this.pingIntervals.set(chatId, pingInterval);
      });

      socket.addEventListener('message', (event) => {
        console.log('WebSocket message received', event.data);

        if (typeof event.data === 'string' && event.data.includes('token')) {
          console.error('Token error:', event.data);
          socket.close();
          return;
        }

        try {
          const data = JSON.parse(event.data);

          if (Array.isArray(data)) {
            const messages = data.reverse(); // API возвращает в обратном порядке
            store.set(`messages.data.${chatId}`, messages);
          } else if (data.type === 'message') {
            const currentMessages = store.getState().messages?.data?.[chatId] || [];
            store.set(`messages.data.${chatId}`, [...currentMessages, data]);
          } else if (data.type === 'pong') {
            console.log('Pong received');
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e, event.data);
        }
      });

      socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
      });

      socket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed', event.code, event.reason);

        const interval = this.pingIntervals.get(chatId);
        if (interval) {
          clearInterval(interval);
          this.pingIntervals.delete(chatId);
        }

        this.sockets.delete(chatId);

        if (event.code === 1000 && event.reason.includes('token')) {
          console.log('Token expired, trying to reconnect...');
          setTimeout(() => {
            if (store.getState().selectedChat === chatId) {
              this.connectToChat(chatId);
            }
          }, 1000);
        }
      });

      this.sockets.set(chatId, socket);
    } catch (e) {
      console.error('Error connecting to chat:', e);
    }
  }

  sendMessage(chatId: number, message: string) {
    const socket = this.sockets.get(chatId);

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }

    socket.send(JSON.stringify({
      content: message,
      type: 'message',
    }));
  }

  async addUserToChat(chatId: string | number, userLogin: string): Promise<boolean> {
    console.log('addUserToChat called', { chatId, userLogin });
    if (chatId === undefined || chatId === null) {
      console.warn('addUserToChat: chatId is not set');
      return false;
    }

    try {
      const userId = await this.getUserIdByLogin(userLogin);
      console.log('resolved userId', userId);
      if (!userId) {
        return false;
      }

      console.log('calling chatApi.addUsers', { chatId, userId });
      await this.api.addUsers(Number(chatId), [userId]);

      return true;
    } catch (e) {
      console.error('addUserToChat error', e);
      store.set('chats.error', e as Error);
      throw e;
    }
  }

  private async getUserIdByLogin(login: string): Promise<number | null> {
    console.log('searchByLogin request', login);
    try {
      const response = await this.userApi.searchByLogin(login);
      console.log('searchByLogin response', response);
      const users = JSON.parse(response.response);

      if (Array.isArray(users) && users.length > 0) {
        return users[0].id;
      }

      return null;
    } catch (e) {
      console.error('Error searching user:', e);
      return null;
    }
  }

  async delete(id: number) {
    try {
      await this.api.delete(id);

      store.set('selectedChat', undefined);
      store.set('selectedChatInfo', undefined);

      await this.fetchChats();
    } catch (e) {
      console.error('Error deleting chat:', e);
      alert('Ошибка при удалении чата');
    }
  }

  async deleteUserFromChat(chatId: number, login: string) {
    try {
        const userId = await this.getUserIdByLogin(login);
        if (!userId) {
            store.set('chats.error', 'Пользователь не найден');
            return;
        }
        await this.api.deleteUsers(chatId, [userId]);
    } catch (e) {
        console.error('Error deleting user:', e);
        throw e;
    }
  }
}

export default new ChatController();
