import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IUser, SessionEvent } from 'src/app/model/model.interfaces';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.ts.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

@Component({
  selector: 'app-menu-unrouted',
  templateUrl: './menu-unrouted.component.html',
  styleUrls: ['./menu-unrouted.component.css']
})
export class MenuUnroutedComponent implements OnInit {

  strUserName: string = "";
  oSessionUser: IUser | null = null;

  constructor(
    private oSessionService: SessionAjaxService,
    private oUserAjaxService: UserAjaxService
  ) {
    this.strUserName = oSessionService.getUsername();
    this.oUserAjaxService.getByUsername(this.oSessionService.getUsername()).subscribe({
      next: (oUser: IUser) => {
        this.oSessionUser = oUser;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  ngOnInit() {
    this.oSessionService.on().subscribe({
      next: (data: SessionEvent) => {
        if (data.type == 'login') {
          this.strUserName = this.oSessionService.getUsername();
          this.oUserAjaxService.getByUsername(this.oSessionService.getUsername()).subscribe({
            next: (oUser: IUser) => {
              this.oSessionUser = oUser;
            },
            error: (error: HttpErrorResponse) => {
              console.log(error);
            }
          });
        }
        if (data.type == 'logout') {
          this.strUserName = "";
        }
      }
    });


  }
}


