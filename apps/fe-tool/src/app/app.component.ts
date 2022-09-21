import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  loginFormGroup!: FormGroup;
  isSubmitted = false;
  authError = false;
  authMessage = 'Tài khoản hoạc mật khẩu không hợp lệ';

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,

    private router: Router
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
  }

  private initLoginForm() {
    this.loginFormGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.loginFormGroup.invalid) return;

    this.auth
      .login(this.loginForm['username'].value, this.loginForm['password'].value)
      .subscribe
      // (user: any) => {
      //   this.authError = false;
      //   // this.localstorageService.setToken(user.token);
      //   this.router.navigate(['/']);
      // },
      // (error: HttpErrorResponse) => {
      //   // console.log(error)
      //   this.authError = true;
      //   if (error.status !== 400) {
      //     this.authMessage = 'Đã xảy ra lỗi, xin hảy thử lại!';
      //   }
      // }
      ();
  }

  get loginForm() {
    return this.loginFormGroup.controls;
  }
}
