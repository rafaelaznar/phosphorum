import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IThread, IThreadPage } from 'src/app/model/model.interfaces';
import { ThreadAjaxService } from 'src/app/service/thread.ajax.service.service';
import { FormControl, FormGroup } from '@angular/forms';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-admin-thread-selection-unrouted',
  templateUrl: './admin-thread-selection-unrouted.component.html',
  styleUrls: ['./admin-thread-selection-unrouted.component.css']
})

export class AdminThreadSelectionUnroutedComponent implements OnInit {

  @Input() id_user: number = 0; //filter by user

  oPage: IThreadPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oThreadToRemove: IThread | null = null;
  threads: any[] | undefined;
  filteredThreads: IThread[] | undefined;
  selectedThreads: IThread | undefined;
  formGroup: FormGroup;
  constructor(
    private oThreadAjaxService: ThreadAjaxService,
    public oDialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef,
    
    ) {    this.formGroup = new FormGroup({
      selectedThreads: new FormControl<any | null>(null)
    }); }

  ngOnInit() {
    this.getPage();
  }

  filterThreads(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
  
    if (query.length > 2) {
      this.oThreadAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_user, query).subscribe({
        next: (data: IThreadPage) => {
          this.oPage = data;
          this.oPaginatorState.pageCount = data.totalPages;
          console.log(this.oPaginatorState);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        }
      });
    } else {
      this.getPage(); 
    }
  }
  

  getPage(): void {
    this.oThreadAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_user).subscribe({
      next: (data: IThreadPage) => {
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

  onSelectThread(oThread: IThread) {
    this.oDynamicDialogRef.close(oThread);
  }

}
