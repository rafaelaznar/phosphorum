import { Component, OnInit } from '@angular/core';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.ts.service';

@Component({
  selector: 'app-menu-unrouted',
  templateUrl: './menu-unrouted.component.html',
  styleUrls: ['./menu-unrouted.component.css']
})
export class MenuUnroutedComponent implements OnInit {

  strUserName: string = "";

  constructor(
    private oSessionService: SessionAjaxService
  ) {

  }

  ngOnInit() {
    this.oSessionService.on({ type: 'login' }).subscribe({
      next: (data: any) => {
        if (data.type == 'login') {
          this.strUserName = this.oSessionService.getUsername();
        }
      }
    });
    this.oSessionService.on({ type: 'logout' }).subscribe({
      next: (data: any) => {
        if (data.type == 'logout') {
          this.strUserName = "";
        }
      }
    });
  }
}


