import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { filter } from 'rxjs';
import { IUser, IUserPage } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-admin-user-selection-unrouted',
  templateUrl: './admin-user-selection-unrouted.component.html',
  styleUrls: ['./admin-user-selection-unrouted.component.css']
})

export class AdminUserSelectionUnroutedComponent implements OnInit {

  oPage: IUserPage | undefined;
  orderField: string = "id";
  strFilter: string = "";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oUserToRemove: IUser | null = null;
  users: any[] | undefined;
  filteredUsers: IUser[] | undefined;
  selectedUsers: IUser | undefined;
  formGroup: FormGroup;

  constructor(
    private oUserAjaxService: UserAjaxService,
    public oDialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef
  ) {    this.formGroup = new FormGroup({
    selectedUser: new FormControl<any | null>(null)
  }); }

  ngOnInit() {
    this.getPage();

    
  }
  filterUsers(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
  
    if (query.length > 2) {
      this.oUserAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, query).subscribe({
        next: (data: IUserPage) => {
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

  onSelectUser(oUser: IUser) {
    this.oDynamicDialogRef.close(oUser);
  }


}