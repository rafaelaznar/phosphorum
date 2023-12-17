import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IThread, IThreadPage, IUser } from 'src/app/model/model.interfaces';
import { AdminThreadDetailUnroutedComponent } from '../admin-thread-detail-unrouted/admin-thread-detail-unrouted.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThreadAjaxService } from 'src/app/service/thread.ajax.service.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.ts.service';
import { Subject } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  providers: [ConfirmationService],
  selector: 'app-user-thread-plist-unrouted',
  templateUrl: './user-thread-plist-unrouted.component.html',
  styleUrls: ['./user-thread-plist-unrouted.component.css']
})

export class UserThreadPlistUnroutedComponent implements OnInit {

  @Input() id_user: number = 0; //filter by user
  @Input() reload: Subject<boolean> = new Subject<boolean>();
  @Output() thread_selection = new EventEmitter<IThread>();

  activeOrder: boolean = true; //true=new false=popular always desc
  activeThread: IThread | null = null;

  oPage: IThreadPage | undefined;
  oUser: IUser | null = null; // data of user if id_user is set for filter
  orderField: string = "id";
  orderDirection: string = "desc";
  oPaginatorState: PaginatorState = { first: 0, rows: 50, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oThreadToRemove: IThread | null = null;
  ref: DynamicDialogRef | undefined;

  constructor(
    private oUserAjaxService: UserAjaxService,
    public oSessionService: SessionAjaxService,
    private oThreadAjaxService: ThreadAjaxService,
  ) { }

  ngOnInit() {
    this.reload.subscribe(response => {
      if (response) {
        if (this.activeOrder) {
          this.oThreadAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_user).subscribe({
            next: (data: IThreadPage) => {
              this.oPage = data;
              this.oPaginatorState.pageCount = data.totalPages;
            },
            error: (error: HttpErrorResponse) => {
              this.status = error;
            }
          })
        } else {
          this.oThreadAjaxService.getPageByRepliesNumberDesc(this.oPaginatorState.rows, this.oPaginatorState.page, 0).subscribe({
            next: (data: IThreadPage) => {
              this.oPage = data;
              this.oPaginatorState.pageCount = data.totalPages;
            },
            error: (error: HttpErrorResponse) => {
              this.status = error;
            }
          })
        }
      }
    });
    if (this.activeOrder) {
      this.getPage();
    } else {
      this.getPageByRepliesNumberDesc();
    }
    if (this.id_user > 0) {
      this.getUser();
    }
  }

  getPage(): void {
    this.oThreadAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_user).subscribe({
      next: (data: IThreadPage) => {
        this.oPage = data;
        if (this.oPage.content.length > 0) {
          this.activeThread = this.oPage.content[0];
          this.thread_selection.emit(this.activeThread);
        }
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
    if (this.activeOrder) {
      this.getPage();
    } else {
      this.getPageByRepliesNumberDesc();
    }
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

  doShowReplies(oThread: IThread) {
    this.thread_selection.emit(oThread);
    this.activeThread = oThread;
    return false;
  }

  onOrderChange(event: any) {
    this.activeOrder = !this.activeOrder;
    this.orderDirection = "desc";
    if (this.activeOrder) {
      this.getPage();
    } else {
      this.getPageByRepliesNumberDesc();
    }
  }

  getPageByRepliesNumberDesc(): void {
    this.oThreadAjaxService.getPageByRepliesNumberDesc(this.oPaginatorState.rows, this.oPaginatorState.page, 0).subscribe({
      next: (data: IThreadPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        this.activeThread = this.oPage.content[0];
        this.thread_selection.emit(this.activeThread);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    })
  }
  targetList: any[] = [];
  
  onItemDropped(event: CdkDragDrop<any[]>) {
    if (event.previousContainer !== event.container) {
      // Si el elemento se suelta en un contenedor diferente, lo movemos a nuestra lista local
      const movedItem = event.previousContainer.data[event.previousIndex];
      this.targetList.push({ ...movedItem });

      // Eliminamos el elemento del contenedor original
      event.previousContainer.data.splice(event.previousIndex, 1);
    }
  }
}