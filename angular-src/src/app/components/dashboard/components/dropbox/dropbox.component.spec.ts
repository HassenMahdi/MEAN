/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DropboxComponent } from './dropbox.component';

describe('DropboxComponent', () => {
  let component: DropboxComponent;
  let fixture: ComponentFixture<DropboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
