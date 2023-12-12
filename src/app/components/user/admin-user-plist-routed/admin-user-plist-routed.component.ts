import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-user-plist-routed',
  templateUrl: './admin-user-plist-routed.component.html',
  styleUrls: ['./admin-user-plist-routed.component.css']
})
export class AdminUserPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  bLoading: boolean = false;

  constructor(
    private oUserAjaxService: UserAjaxService,
    private oConfirmationService: ConfirmationService,
    private oMatSnackBar: MatSnackBar,
    private oTranslocoService: TranslocoService
  ) { }

  ngOnInit() { }

  doGenerateRandom(amount: number) {
    this.bLoading = true;
    this.oUserAjaxService.generateRandom(amount).subscribe({
      next: (oResponse: number) => {
        this.oMatSnackBar.open(this.oTranslocoService.translate('global.now-there-are') + ' ' + oResponse + this.oTranslocoService.translate('users.lowercase.plural'), '', { duration: 2000 });
        this.bLoading = false;
      },
      error: (oError: HttpErrorResponse) => {
        this.oMatSnackBar.open(this.oTranslocoService.translate('global.error') + ' ' + this.oTranslocoService.translate('global.generating') + this.oTranslocoService.translate('user.lowercase.plural') + ': ' + oError.message, '', { duration: 2000 });
        this.bLoading = false;
      },
    })
  }

  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: this.oTranslocoService.translate('user.remove-all-question'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.oTranslocoService.translate('global.yes'),
      rejectLabel: this.oTranslocoService.translate('global.no'),
      accept: () => {
        this.oUserAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMatSnackBar.open(this.oTranslocoService.translate('global.now-there-are') + ' ' + oResponse + this.oTranslocoService.translate('users.lowercase.plural'), '', { duration: 2000 });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open(this.oTranslocoService.translate('global.error') + ' ' + this.oTranslocoService.translate('global.emptying') + this.oTranslocoService.translate('user.lowercase.plural') + ': ' + oError.message, '', { duration: 2000 });
            this.bLoading = false;
          },
        })
      },
      reject: () => {
        this.oMatSnackBar.open(this.oTranslocoService.translate('plist.empty') + ' ' + this.oTranslocoService.translate('global.cancelled') + '!', '', { duration: 2000 });
      }
    });
  }

}
