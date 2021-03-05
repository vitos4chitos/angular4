import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MainService {
  constructor(public httpClient: HttpClient) { }
  currentUser: string;
  getCurrentUser():Observable<string> {
    return of(this.currentUser);
  }
  setCurrentUser(cu: string) {
    this.currentUser = cu;
  }
}
