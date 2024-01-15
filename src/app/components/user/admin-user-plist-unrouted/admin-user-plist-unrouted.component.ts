import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IUser, IUserPage } from 'src/app/model/model.interfaces';
import { AdminUserDetailUnroutedComponent } from '../admin-user-detail-unrouted/admin-user-detail-unrouted.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

import { UserPrintAjaxService } from 'src/app/service/user.print.ajax.service';
import { Subject, filter, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-user-plist-unrouted',
  templateUrl: './admin-user-plist-unrouted.component.html',
  styleUrls: ['./admin-user-plist-unrouted.component.css']
})

export class AdminUserPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();

  oPage: IUserPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oUserToRemove: IUser | null = null;

  constructor(
    private oUserAjaxService: UserAjaxService,
    public oDialogService: DialogService,
    private oCconfirmationService: ConfirmationService,
    private oMatSnackBar: MatSnackBar,
    private oUserPrintAjaxService: UserPrintAjaxService,
    private oTranslocoService: TranslocoService

  ) { }

  ngOnInit() {
    this.getPage();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      }
    });
  }
// Inside your component class

search(filterValue: string): void {
  // Assuming oPageService is the service handling the user page data

  // Check if filterValue is null or less than 3 characters
  if (filterValue && filterValue.length >= 3) {
    // If filterValue is valid, debounce the search
    this.oUserAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.first, 'id', 'asc', filterValue)
      .pipe(
        debounceTime(500),
        switchMap((data: IUserPage) => {
          return of(data);
        })
      )
      .subscribe(
        (data: IUserPage) => {
          this.oPage = data;
        },
        (error: any) => {
          // Handle error
          console.error(error);
        }
      );
  } else {
    // If filterValue is null or less than 3 characters, load all users without debounce
    this.oUserAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.first, 'id', 'asc')
      .subscribe(
        (data: IUserPage) => {
          this.oPage = data;
        },
        (error: any) => {
          // Handle error
          console.error(error);
        }
      );
  }
}

getValue(event: any): string {
  return event.target.value;
}

  getPage(): void {
    this.oUserAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection).subscribe({
      next: (data: IUserPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        console.log(this.oPaginatorState);
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

  ref: DynamicDialogRef | undefined;

  doView(u: IUser) {
    this.ref = this.oDialogService.open(AdminUserDetailUnroutedComponent, {
      data: {
        id: u.id
      },
      header: this.oTranslocoService.translate('global.view') + ' ' + this.oTranslocoService.translate('user.lowercase.singular'),
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
  }

  doRemove(u: IUser) {
    this.oUserToRemove = u;
    this.oCconfirmationService.confirm({
      accept: () => {
        this.oMatSnackBar.open(this.oTranslocoService.translate('global.the.masc') + ' ' + this.oTranslocoService.translate('user.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.remove.has.masc'), '', { duration: 2000 });
        this.oUserAjaxService.removeOne(this.oUserToRemove?.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open(this.oTranslocoService.translate('global.the.masc') + ' ' + this.oTranslocoService.translate('user.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.remove.hasnt.masc'), "", { duration: 2000 });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.oMatSnackBar.open(this.oTranslocoService.translate('global.the.masc') + ' ' + this.oTranslocoService.translate('user.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.remove.hasnt.masc'), "", { duration: 2000 });
      }
    });
  }

  //Añado esto
  onPrintUser = (id_user: number) => {
    this.oUserPrintAjaxService.printUser(id_user);
  }

  toggleUserActive(user: IUser): void {
    const userToUpdate: IUser = { ...user };
    delete userToUpdate.threads;
    delete userToUpdate.replies;

    userToUpdate.active = !userToUpdate.active;

    this.oUserAjaxService.updateOne(userToUpdate).subscribe({
      next: () => {
        this.forceReload.next(true);
      },
      error: (error) => {
        userToUpdate.active = !userToUpdate.active;
      }
    });
  }

}
