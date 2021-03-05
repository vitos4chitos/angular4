import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MainService} from "../../services/main.service";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  form: FormGroup;

  formErrors:any = {
    'password': '',
    'login': '',
  };

  messageErrors: any = {
    'password': {
      'required': 'Пароль обязателен'
    },
    'login': {
      'required': 'Логин обязателен',
    }
  };

  user: {
    login: string;
    password: string;
  };

  constructor(private auth: AuthService, private router: Router, private mainServer: MainService) { }

  ngOnInit(): void {
    console.log(sessionStorage.getItem('main') === 'yes');
    if (sessionStorage.getItem('main') === 'yes') {
      this.router.navigate(["/main"]);
    } else {
      localStorage.clear();
    }
    this.form = new FormGroup({
        login: new FormControl("", [Validators.required]),
        password: new FormControl("", [Validators.required])
    })
    this.form.valueChanges.subscribe((data) => this.onValueChange(data));
    this.onValueChange("");
  }

  onSubmit(data: string) {
    if(data === 'LogIn'){
      this.user = this.form.value;
      this.mainServer.setCurrentUser(this.user.login);
      localStorage.setItem("user", this.mainServer.currentUser);
      this.auth.login(this.form.value)
    }
    else{
      this.user = this.form.value;
      this.mainServer.setCurrentUser(this.user.login);
      localStorage.setItem("user", this.mainServer.currentUser);
      this.auth.reg(this.form.value);
    }
  }

  onValueChange(data: any) {
    if (!this.form) {
      return;
    }
    const formm = this.form;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = formm.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.messageErrors[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
