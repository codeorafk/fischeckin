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
  constructor(private readonly service: EmployeeService) {
    this.getUsers();
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
  setUsers(user: User) {
    this.service.setUsers(user).subscribe();
  }
}
