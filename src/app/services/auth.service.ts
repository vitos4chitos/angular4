import {Injectable} from '@angular/core';
import {User} from "./interfaces";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {root} from "rxjs/internal-compatibility";


@Injectable({
    providedIn: 'root'
  }
)
export class AuthService {

  url_auth = "http://localhost:42011/Lab4_war/auth";
  url_reg = "http://localhost:42011/Lab4_war/reg"
  url_check = "http://localhost:42011/Lab4_war/checker"
  private token: string = '';
  private checker: string = 'прикол';
  private isChecker: boolean;
  user2: {
    login: string;
    password: string;
  };
  private loginFlag: boolean = false;

  register() {

  }

  login(user: User) {
    localStorage.setItem("user", user.login);
    this.http.post(this.url_auth, user).subscribe(
      (res: any) => {
        console.log(res['token'])
        if (res["token"] !== "bad") {
          localStorage.setItem("token", res["token"]);
          this.loginFlag = true;
          this.router.navigateByUrl("/~s284691/dist/ClientPart/main");
        } else
          alert("Неправильный логин или пароль");
      },
      error => {
        alert("Что-то не так с сервером, попробуйте позже")
      }
    );

  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl("/~s284691/dist/ClientPart/start");
    this.token = '';
  }

  constructor(private http: HttpClient, private router: Router) {

  }

  // @ts-ignore
  isTokenExpired(): boolean {
    this.checkToken()
    console.log(this.loginFlag)
    console.log(this.checker + " прикол номер 1");
    console.log(localStorage.getItem("token") + " прикол номер 2")
    if ((this.isChecker && this.checker === localStorage.getItem("token")) || this.loginFlag) {
      console.log("пропускаю")
      this.loginFlag = false;
      return true;
    } else {
      console.log("не пропускаю")
      return false;
    }
  }

  getToken() {
    return localStorage.getItem("token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', this.token);
  }

  reg(user: User) {
    localStorage.setItem("user", user.login);
    this.http.post(this.url_reg, user).subscribe(
      (res: any) => {
        if (res["token"] !== "bad") {
          if (res["token"] !== "connection error") {
            localStorage.setItem("token", res["token"]);
            this.setToken(res["token"]);
            this.loginFlag = true;
            this.router.navigateByUrl("/~s284691/dist/ClientPart/main");
          } else {
            alert("Что-то не так с сервером, попробуйте позже");
          }
        } else
          alert("Пользователь с таким именем уже существует");
      },
      error => {
        alert("Что-то не так с сервером, попробуйте позже")
      }
    );
  }

  checkToken() {
    if (localStorage.getItem("user") != null) {
      console.log(localStorage.getItem("user"))
      let user = {
        login:localStorage.getItem("user"),
        password:"123"
      }
      //this.user2.login = <string>localStorage.getItem("user");
        //this.user2.password = "123"
      this.http.post(this.url_check, user).subscribe(
        (res: any) => {
          if (res["token"] !== "bad") {
            if (res["token"] !== "connection error") {
              this.checker = res["token"];
              this.isChecker = true;
            } else {
              this.checker = res["token"];
              this.isChecker = false;
            }
          } else {
            this.checker = res["token"];
            this.isChecker = false;
          }
        },
        error => {
          this.checker = "bad 321"
          this.isChecker = false;
        }
      );
    }
    else {
      this.checker = "bad 123"
      this.isChecker = false;
    }
  }
}
