import { HTTPTransport } from '../utils/request.ts'

export class ChatApi {
  protected http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport('/chats');
  }

  read(): Promise<XMLHttpRequest> {
    return this.http.get('/');
  }

  create(title: string) {
    return this.http.post('/', { data: { title } });
  }

  delete(id: number): Promise<XMLHttpRequest> {
    return this.http.delete('/', { data: { chatId: id } });
  }

  addUsers(id: number, users: number[]): Promise<XMLHttpRequest> {
    return this.http.put('/users', { data: { users, chatId: id } });
  }

  deleteUsers(id: number, users: number[]): Promise<XMLHttpRequest> {
    return this.http.delete('/users', { data: { users, chatId: id } });
  }

  async getToken(id: number): Promise<string> {
    try {
      const response = await this.http.post(`/token/${id}`);
      const parsed = JSON.parse(response.response);
      console.log('Token received:', { chatId: id, token: parsed.token?.substring(0, 10) + '...' });
      return parsed.token;
    } catch (e) {
      console.error('Error getting token:', e);
      throw e;
    }
  }
}
