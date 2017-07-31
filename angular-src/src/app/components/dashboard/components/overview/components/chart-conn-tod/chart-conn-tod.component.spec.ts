/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChartConnTodComponent } from './chart-conn-tod.component';

describe('ChartConnTodComponent', () => {
  let component: ChartConnTodComponent;
  let fixture: ComponentFixture<ChartConnTodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartConnTodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartConnTodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
