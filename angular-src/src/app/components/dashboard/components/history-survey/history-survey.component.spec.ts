/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HistorySurveyComponent } from './history-survey.component';

describe('HistorySurveyComponent', () => {
  let component: HistorySurveyComponent;
  let fixture: ComponentFixture<HistorySurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorySurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorySurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
