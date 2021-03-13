import { Component, OnInit } from '@angular/core';
import {MainService} from "../../services/main.service";
import {TableValues} from "./TableValues";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-main',
  templateUrl: './mainP.component.html',
  styleUrls: ['./mainP.component.css']
})
export class MainPComponent implements OnInit {

  url = "http://localhost:42011/Lab4_war/adddot";
  xInput:number;
  rInput:number;
  yInput:number;
  xValues:string[];
  rValues:string[];
  xValuesFiltered:any[];
  rValuesFiltered:any[];
  selectedValues = {
    valueX: 0,
    valueY: 0,
    valueR: 0,
  };
  errorMessage:string = '';
  displayModal = false;
  currentUser: string;
  currentPoint: TableValues;
  rows: TableValues[] = [];
  dots = '';

  constructor(private mainService: MainService, private http: HttpClient, private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.xValues = ['-2','-1.5','-1','-0.5','0','0.5','1','1.5','2'];
    this.rValues = ['-2','-1.5','-1','-0.5','0','0.5','1','1.5','2'];
    this.yInput = 0;
    console.log(sessionStorage.getItem('main'));
    this.getExistingValues(<string>localStorage.getItem("user")).subscribe(values => {
      this.rows = values;
      console.log(this.rows.toString());
      this.dots = '';
      for (let point of this.rows) {
        this.dots += point.x_value + ";" + point.y_value + ";" + point.r_value + ";";
      }
      console.log(this.dots);
      localStorage.setItem('dots', this.dots);
      if (this.dots !== '') {
        let points = this.dots.split(';');
        console.log(points.toString());
        for (let i = 0; i < points.length - 2; i += 3) {
          this.createDot(this.getXSVG(Number(points[i]), Number(points[i + 2])), this.getYSVG(Number(points[i + 1]), Number(points[i + 2])), Number(points[i + 2]));
        }
      }
    });
    this.mainService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
    console.log(this.mainService.getCurrentUser().subscribe(user1 => console.log(user1)));
    if (this.currentUser !== undefined) {
      localStorage.setItem('user', this.currentUser);
    } else {
      this.currentUser = <string>localStorage.getItem('user');
    }
  }

  searchX(event: { query: string; }){
    this.xValuesFiltered = this.xValues.filter(x => x.startsWith(event.query.replace(new RegExp(',', 'g'), '.')));
    console.log(this.xInput)
  }

  searchR(event: { query: string; }){
    this.rValuesFiltered = this.rValues.filter(r => r.startsWith(event.query.replace(new RegExp(',', 'g'), '.')));
    console.log(this.rInput)
  }

  onSubmit() {
    console.log(this.xInput + " " + this.yInput + " " + this.rInput);
    if (this.xInput === undefined || this.xInput.toString() == '') {
      this.showModalDialog('Значение для X не выбрано');
    } else if (this.yInput === undefined) {
      this.showModalDialog('Значение для Y не выбрано');
    } else if (this.rInput === undefined || this.rInput.toString() == '') {
      this.showModalDialog('Значение для R не выбрано');
    } else if(this.xInput.toString().length > 8 || this.rInput.toString().length > 8){
      this.showModalDialog('Что-то не так... слишком большая точность или слишком большие числа')
    } else if(!this.checkODZ(this.xInput, this.yInput, this.rInput)) {
        this.showModalDialog('Выбран неправильный диапазон у X или R');
    }
        else{
          this.selectedValues.valueX = this.xInput;
          this.selectedValues.valueY = this.yInput;
          this.selectedValues.valueR = this.rInput;
          // let x = ((cx - 150) * this.valueR / 100);
          // let y = (150 - cy) * this.valueR / 100;
          this.createDot(this.getXSVG(this.xInput, this.rInput), this.getYSVG(this.yInput, this.rInput), this.rInput);
          this.saveDots(this.getXSVG(this.xInput, this.rInput), this.getYSVG(this.yInput, this.rInput), this.rInput);
          this.commitPoint(localStorage.getItem("user"), this.rInput, this.xInput, this.yInput);
    }
  }

  saveDots(cx:number, cy:number, r:number) {
    this.dots += this.getXCoord(cx, r).toString() + ';' + this.getYCoord(cy, r).toString() + ';' + r.toString() + ';';
    localStorage.setItem('dots', this.dots);
  }

  getXSVG(x:number, r:number): number {
    return x * 100 / r + 150;
  }

  getYSVG(y:number, r:number): number {
    return 150 - y * 100 / r;
  }

  showModalDialog(text:string) {
    this.errorMessage = text;
    this.displayModal = true;
  }

  createDot(cx:number, cy:number, r: number) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    circle.setAttribute('cx', cx.toString());
    circle.setAttribute('cy', cy.toString());
    circle.setAttribute('r', "3");
    circle.setAttribute('fill-opacity', "0.5");
    circle.setAttribute('class', 'points');
    if (this.checkArea(cx, cy, r)) {
      circle.setAttribute("fill", "#4dff00");
    } else {
      circle.setAttribute("fill", "#ff0000");
    }
    console.log(cx + ' ' + cy + ' ' + r + ' ');
    // @ts-ignore
    document.getElementById('svg').appendChild(circle);
  }

  checkArea(cx:number, cy:number, r:number): boolean {
    let x = this.getXCoord(cx, r);
    let y = this.getYCoord(cy, r);
    return (x <= 0 && y >= 0 && x >= -r && y <= r / 2) || (x >= 0 && y >= 0 && x * x + y * y <= (r * r) / 4) || (x >= 0 && y <= 0 && y >= x - r / 2);
  }

  getXCoord(cx:number, r:number): number {
    return (cx - 150) * r / 100;
  }

  getYCoord(cy:number, r:number): number {
    return (150 - cy) * r / 100;
  }

  checkODZ(cx:number, cy:number, r:number): boolean {
    return (cx >= -2 && cx <= 2 && cy < 5 && cy > -5 && r > 0 && r <= 2)
  }

  async commitPoint(username: string | null, r: number, x: number, y: number) {
    if (localStorage.getItem("token") === null || localStorage.getItem("user") === null) {
      localStorage.clear();
      this.router.navigateByUrl("/~s284691/dist/ClientPart/start");
      return;
    }
    if(x == 0) {
      x = 0;
    }
    this.http.post<any>(this.url, {
      "login": username,
      "x": x,
      "y": y,
      "r": r,
    }).subscribe(point => {
      if(point === null){
        localStorage.clear();
        this.router.navigateByUrl("/~s284691/dist/ClientPart/start");
        alert("Сервер временно недоступен. Попробуйте позже")
      }
      else {
        this.currentPoint = new TableValues(point["x"], point["y"], point["r"], point["ingress"]);
        this.rows.push(this.currentPoint);
      }
      },
      error => {
        localStorage.clear();
        this.router.navigateByUrl("/~s284691/dist/ClientPart/start");
        alert("Сервер временно недоступен. Попробуйте позже")
      }
    );
  }
  getExistingValues(username: string): Observable<TableValues[]> {
    let params = new HttpParams().set("login", username);
    return this.http.get<any>(this.url, {params: params}).pipe(map(points => points.map(function (point:any) {
      return new TableValues(point["x"], point["y"], point["r"], point["ingress"]);
    })));
  }

  svgClick(event: any) {
    // @ts-ignore
    let dim = document.getElementById("svg").getBoundingClientRect();
    let cx = event.clientX - dim.left;
    let cy = event.clientY - dim.top;
    if (this.rInput !== undefined && this.rInput !== null) {
      let x = +((cx - 150) * this.rInput / 100).toFixed(2);
      let y = +((150 - cy) * this.rInput / 100).toFixed(2);
      console.log(x);
      console.log(y);
      if (this.checkODZ(x, y, this.rInput)) {
        this.createDot(cx, cy, this.rInput);
        this.saveDots(cx, cy, this.rInput);
        this.commitPoint(localStorage.getItem("user"), this.rInput, x, y);
      } else {
        this.showModalDialog('Значене для X, Y или R выходит за допустимый диапозон');
      }
    } else {
      this.showModalDialog('Выберите значение для R');
    }
  }

  confirm() {
        this.resetSVG();
        this.deletePoints(this.currentUser);
  }

  resetSVG() {
    this.dots = '';
    localStorage.setItem('dots', this.dots);
    document.querySelectorAll("circle").forEach((e) => e.remove());
  }

  deletePoints(username: string) {
    this.http.delete(this.url, {
      params: new HttpParams().set('login', username)
    }).subscribe();
    this.rows = [];
  }
  onExit() {
    sessionStorage.setItem('main', 'no');
    localStorage.clear();
  }
  updateDots() {
    if (this.dots != '' && this.rInput !== null && this.rInput > 0) {
      this.dots = '';
      document.querySelectorAll("circle").forEach((e) => e.remove());
      // @ts-ignore
      let points = localStorage.getItem('dots').split(';');
      for (let i = 0; i < points.length - 2; i += 3) {
        let new_cx = this.getXSVG(parseFloat(points[i]), this.rInput);
        let new_cy = this.getYSVG(parseFloat(points[i + 1]), this.rInput);
        this.createDot(new_cx, new_cy, this.rInput);
        this.saveDots(new_cx, new_cy, this.rInput);
      }
    }
  }




}
