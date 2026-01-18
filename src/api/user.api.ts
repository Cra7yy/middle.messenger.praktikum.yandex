import { HTTPTransport } from '../utils/request.ts'

export class UserApi {
  protected http: HTTPTransport;
  protected httpUser: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport('/auth');
    this.httpUser = new HTTPTransport('/user');
  }

  signUp(data: Record<string, unknown>): Promise<XMLHttpRequest> {
    return this.http.post('/signup', { data });
  }

  signIn(data: Record<string, unknown>): Promise<XMLHttpRequest> {
    return this.http.post('/signin', { data });
  }

  read(): Promise<XMLHttpRequest> {
    return this.http.get('/user');
  }

  logout(): Promise<XMLHttpRequest> {
    return this.http.post('/logout');
  }

  updateProfile(data: Record<string, unknown>): Promise<XMLHttpRequest> {
    return this.httpUser.put('/profile', { data });
  }

  updatePassword(data: Record<string, unknown>): Promise<XMLHttpRequest> {
    return this.httpUser.put('/password', { data });
  }

  changeAvatar(data: FormData): Promise<XMLHttpRequest> {
    return this.httpUser.put('/profile/avatar', { data });
  }

  searchByLogin(login: string): Promise<XMLHttpRequest> {
    return this.httpUser.post('/search', { data: { login } });
  }
}
