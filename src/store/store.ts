import EventBus from '../framework/EventBus';
import { set } from '../utils/set.ts'
import type { User } from '../type/user.type.ts'
import type { ChatInfo, Message } from '../type/chat.type.ts'

export const StoreEvents = {
  UPDATED: 'updated',
} as const;

interface StoreState {
  user: {
    data: User;
    error: null | Error,
    isLoading: boolean;
  };
  chats?: {
    data: ChatInfo[];
    error: null | Error,
    isLoading: boolean;
  };
  messages?: {
    data: Record<number | string, Message[]>,
    error: null | Error,
    isLoading: boolean;
  };
  selectedChat?: number | string;
  selectedChatInfo?: ChatInfo;
  resources? : {
    avatar?: string
  }
}

class Store extends EventBus {
  private state: StoreState = {} as StoreState;

  public set(path: string, data: unknown) {
    set(this.state, path, data);

    this.emit(StoreEvents.UPDATED, this.getState());
  }

  public getState() {
    return this.state;
  }
}

const store = new Store();

export default store;
