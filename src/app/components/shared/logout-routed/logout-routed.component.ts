import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.ts.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-logout-routed',
  templateUrl: './logout-routed.component.html',
  styleUrls: ['./logout-routed.component.css']
})

export class LogoutRoutedComponent implements OnInit {

  constructor(
    private oSessionService: SessionAjaxService,
    private oMatSnackBar: MatSnackBar,
    private oRouter: Router,
    private oTranslocoService: TranslocoService
  ) { }

  ngOnInit() {
  }

  logout() {
    this.oSessionService.logout();
    this.oSessionService.emit({ type: 'logout' });
    this.oMatSnackBar.open(this.oTranslocoService.translate('logout.successfull'), '', { duration: 2000 });
    this.oRouter.navigate(['/home']);
  }

  cancel() {
    this.oRouter.navigate(['/home']);
  }

}
