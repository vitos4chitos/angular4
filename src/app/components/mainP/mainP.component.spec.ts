import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPComponent } from './mainP.component';

describe('MainComponent', () => {
  let component: MainPComponent;
  let fixture: ComponentFixture<MainPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
