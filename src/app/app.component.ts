import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Web4';
  ngOnInit() {
    const potentialToken = localStorage.getItem('token');
    if(potentialToken !== null){
      this.auth.setToken(potentialToken);
    }
  }

  constructor(private auth: AuthService) {
  }
}
