import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { ThreadAjaxService } from 'src/app/service/thread.ajax.service.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-thread-plist-routed',
  templateUrl: './admin-thread-plist-routed.component.html',
  styleUrls: ['./admin-thread-plist-routed.component.css']
})
export class AdminThreadPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  id_user: number;
  bLoading: boolean = false;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oThreadAjaxService: ThreadAjaxService,
    private oConfirmationService: ConfirmationService,
    private oMatSnackBar: MatSnackBar,
    private oTranslocoService: TranslocoService
  ) {
    this.id_user = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") ?? "0");
  }

  ngOnInit() { }

  doGenerateRandom(amount: number) {
    this.bLoading = true;
    this.oThreadAjaxService.generateRandom(amount).subscribe({
      next: (oResponse: number) => {
        this.oMatSnackBar.open(this.oTranslocoService.translate('global.now-there-are') + ' ' + oResponse + ' '  + this.oTranslocoService.translate('thread.lowercase.plural'), '', { duration: 2000 });
        this.bLoading = false;
      },
      error: (oError: HttpErrorResponse) => {
        this.oMatSnackBar.open(this.oTranslocoService.translate('global.error') + ' ' + this.oTranslocoService.translate('global.generating') + ' ' + this.oTranslocoService.translate('thread.lowercase.plural') + ': ' + oError.message, '', { duration: 2000 });
        this.bLoading = false;
      },
    })
  }

  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: this.oTranslocoService.translate('thread.remove-all-question'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.oTranslocoService.translate('global.yes'),
      rejectLabel: this.oTranslocoService.translate('global.no'),
      accept: () => {
        this.oThreadAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMatSnackBar.open(this.oTranslocoService.translate('global.now-there-are') + ' ' + oResponse + ' ' + this.oTranslocoService.translate('thread.lowercase.plural'), '', { duration: 2000 });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open(this.oTranslocoService.translate('global.error') + ' ' + this.oTranslocoService.translate('global.emptying') + ' ' + this.oTranslocoService.translate('thread.lowercase.plural') + ': ' + oError.message, '', { duration: 2000 });
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

