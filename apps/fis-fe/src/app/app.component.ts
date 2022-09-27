import { Component } from '@angular/core';
import { EmployeeService } from './employee.service';
import { User } from './user';

@Component({
  selector: 'nx-project-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public users: User[] = [];
  public passwords: string[] = [];
  public username: string | undefined;
  public isOkay = false;
  constructor(private readonly service: EmployeeService) {
    this.getUsers();
  }
  checkUser(username: string) {
    return;
  }
  getUsers() {
    this.service.getUsers().subscribe((users) => {
      this.users = users;
      this.passwords = users.map(() => '');
    });
  }
  onClick(idx: number) {
    const tmpUser = new User(this.users[idx]);
    if (this.passwords[idx].length > 0) tmpUser.passWord = this.passwords[idx];
    this.setUsers(tmpUser);
  }
  onChange(idx: number) {
    this.onClick(idx);
  }
  login() {
    this.isOkay = true;
  }
  setUsers(user: User) {
    this.service.setUsers(user).subscribe();
  }
}
