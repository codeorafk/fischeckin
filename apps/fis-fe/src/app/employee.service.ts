import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private url = 'http://localhost:3333/api/';
  constructor(private http: HttpClient) {}
  getUsers() {
    return this.http.get<User[]>(this.url + 'user');
  }
  setUsers(_user: User) {
    const tmp = {
      'user-name': _user.userName,
      'pass-word': _user.passWord,
      isCheckin: _user.isCheckin,
      device: _user.device,
    };
    return this.http.post(this.url + 'edit', tmp);
  }
}
