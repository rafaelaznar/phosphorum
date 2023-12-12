import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { ReplyAjaxService } from 'src/app/service/reply.ajax.service.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-reply-plist-routed',
  templateUrl: './admin-reply-plist-routed.component.html',
  styleUrls: ['./admin-reply-plist-routed.component.css']
})
export class AdminReplyPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  id_user: number;
  id_thread: number;
  bLoading: boolean = false;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oReplyAjaxService: ReplyAjaxService,
    private oConfirmationService: ConfirmationService,
    private oMatSnackBar: MatSnackBar,
    private oTranslocoService: TranslocoService
  ) {
    this.id_user = parseInt(this.oActivatedRoute.snapshot.paramMap.get("iduser") ?? "0");
    this.id_thread = parseInt(this.oActivatedRoute.snapshot.paramMap.get("idthread") ?? "0");
  }

  ngOnInit() { }

  doGenerateRandom(amount: number) {
    this.bLoading = true;
    this.oReplyAjaxService.generateRandom(amount).subscribe({
      next: (oResponse: number) => {
        this.oMatSnackBar.open(this.oTranslocoService.translate('global.now-there-are') + ' ' + oResponse + this.oTranslocoService.translate('reply.lowercase.plural'), '', { duration: 2000 });
        this.bLoading = false;
      },
      error: (oError: HttpErrorResponse) => {
        this.oMatSnackBar.open(this.oTranslocoService.translate('global.error') + ' ' + this.oTranslocoService.translate('global.generating') + this.oTranslocoService.translate('reply.lowercase.plural') + ': ' + oError.message, '', { duration: 2000 });
        this.bLoading = false;
      },
    })
  }

  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: this.oTranslocoService.translate('reply.remove-all-question'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.oTranslocoService.translate('global.yes'),
      rejectLabel: this.oTranslocoService.translate('global.no'),
      accept: () => {
        this.oReplyAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMatSnackBar.open(this.oTranslocoService.translate('global.now-there-are') + ' ' + oResponse + this.oTranslocoService.translate('reply.lowercase.plural'), '', { duration: 2000 });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open(this.oTranslocoService.translate('global.error') + ' ' + this.oTranslocoService.translate('global.emptying') + this.oTranslocoService.translate('reply.lowercase.plural') + ': ' + oError.message, '', { duration: 2000 });
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
