import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private url = 'http://localhost:3333/api/';
  constructor(private http: HttpClient) {}
  getUsers() {
    return this.http.get<User[]>(this.url + 'user');
  }
  checkUser(_user: User) {
    return;
  }
  setUsers(_user: User): Observable<unknown> {
    if (_user.passWord?.trim().length === 0) return of(undefined);
    const tmp = {
      'user-name': _user.userName,
      'pass-word': _user.passWord,
      isCheckin: _user.isCheckin,
      device: _user.device,
    };
    return this.http.post(this.url + 'edit', tmp);
  }
}
