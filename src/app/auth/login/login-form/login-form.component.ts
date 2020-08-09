import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  @Output()
  loginClicked: EventEmitter<any> = new EventEmitter<any>();

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onLoginClicked(): void {
    const userDetails = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value,
    };
    this.loginClicked.emit(userDetails);
  }
}
