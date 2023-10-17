/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserUnroutedDetailAdminComponent } from './user-unrouted-detail-admin.component';

describe('UserUnroutedDetailAdminComponent', () => {
  let component: UserUnroutedDetailAdminComponent;
  let fixture: ComponentFixture<UserUnroutedDetailAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserUnroutedDetailAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUnroutedDetailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
