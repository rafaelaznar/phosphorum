import { Component, OnInit } from '@angular/core';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.ts.service';

@Component({
  selector: 'app-menu-unrouted',
  templateUrl: './menu-unrouted.component.html',
  styleUrls: ['./menu-unrouted.component.css']
})
export class MenuUnroutedComponent implements OnInit {

  strUserName: string = "";

  constructor(private oSessionService: SessionAjaxService) { 

    if (this.oSessionService.isSessionActive()){
      this.strUserName=this.oSessionService.getUsername();
    }


  }

  ngOnInit() {
  }

}
