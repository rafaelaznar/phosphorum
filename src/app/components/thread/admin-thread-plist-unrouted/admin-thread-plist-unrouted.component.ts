import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IThread, IThreadPage, IUser } from 'src/app/model/model.interfaces';
import { AdminThreadDetailUnroutedComponent } from '../admin-thread-detail-unrouted/admin-thread-detail-unrouted.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThreadAjaxService } from 'src/app/service/thread.ajax.service.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { Subject, debounceTime, of, switchMap } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-thread-plist-unrouted',
  templateUrl: './admin-thread-plist-unrouted.component.html',
  styleUrls: ['./admin-thread-plist-unrouted.component.css']
})

export class AdminThreadPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_user: number = 0; //filter by user

  oPage: IThreadPage | undefined;
  oUser: IUser | null = null; // data of user if id_user is set for filter
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oThreadToRemove: IThread | null = null;
  ref: DynamicDialogRef | undefined;

  constructor(
    private oUserAjaxService: UserAjaxService,
    private oThreadAjaxService: ThreadAjaxService,
    public oDialogService: DialogService,
    private oCconfirmationService: ConfirmationService,
    private oMatSnackBar: MatSnackBar,
    private oTranslocoService: TranslocoService
  ) { }

  ngOnInit() {
    this.getPage();
    if (this.id_user > 0) {
      this.getUser();
    }
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      }
    });
  }

  getPage(): void {
    this.oThreadAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_user).subscribe({
      next: (data: IThreadPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    })
  }

  onPageChang(event: PaginatorState) {
    this.oPaginatorState.rows = event.rows;
    this.oPaginatorState.page = event.page;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    if (this.orderDirection == "asc") {
      this.orderDirection = "desc";
    } else {
      this.orderDirection = "asc";
    }
    this.getPage();
  }
  getValue(event: any): string {
    return event.target.value;
  }
  search(filterValue: string): void {

    if (filterValue.length >= 3) {
      
      this.oThreadAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.first, 'id', 'asc', this.id_user,filterValue)
        .pipe(
          debounceTime(500),
          switchMap((data: IThreadPage) => {
            return of(data);
          })
        )
        .subscribe(
          (data: IThreadPage) => {
            this.oPage = data;
          },
          (error: any) => {
            // Handle error
            console.error(error);
          }
        );
    } else {
      // If filterValue is null or less than 3 characters, load all users without debounce
      this.oThreadAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.first, 'id', 'asc', this.id_user)
        .subscribe(
          (data: IThreadPage) => {
            this.oPage = data;
          },
          (error: any) => {
            // Handle error
            console.error(error);
          }
        );
    }
  }
  doView(u: IThread) {
    this.ref = this.oDialogService.open(AdminThreadDetailUnroutedComponent, {
      data: {
        id: u.id
      },
      header: this.oTranslocoService.translate('global.view') + ' ' + this.oTranslocoService.translate('thread.lowercase.singular'),
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
  }

  doRemove(u: IThread) {
    this.oThreadToRemove = u;
    this.oCconfirmationService.confirm({
      accept: () => {
        this.oMatSnackBar.open(this.oTranslocoService.translate('global.the.masc') + ' ' + this.oTranslocoService.translate('thread.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.remove.has.masc'), '', { duration: 2000 });
        this.oThreadAjaxService.removeOne(this.oThreadToRemove?.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open(this.oTranslocoService.translate('global.the.masc') + ' ' + this.oTranslocoService.translate('thread.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.remove.hasnt.masc'), "", { duration: 2000 });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.oMatSnackBar.open(this.oTranslocoService.translate('global.the.masc') + ' ' + this.oTranslocoService.translate('thread.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.remove.hasnt.masc'), "", { duration: 2000 });
      }
    });
  }

  getUser(): void {
    this.oUserAjaxService.getOne(this.id_user).subscribe({
      next: (data: IUser) => {
        this.oUser = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }

}