import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';


interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-admin-user-plist-unrouted',
  templateUrl: './admin-user-plist-unrouted.component.html',
  styleUrls: ['./admin-user-plist-unrouted.component.css']
})
export class AdminUserPlistUnroutedComponent implements OnInit {

  datos: any = [];


  first: number = 0;
  rows: number = 10;
  page: number = 0;


  cols!: any[];

  constructor(
    private oHttpClient: HttpClient
  ) { }

  ngOnInit() {
    this.getPage();
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'surname', header: 'Surname' },
      { field: 'lastname', header: 'Last Name' },
      { field: 'email', header: 'Email' },
      { field: 'username', header: 'Username' },
      { field: 'rol', header: 'Rol' },
    ];
  }

  getPage(): void {
    this.oHttpClient.get("http://localhost:8083/user" + "?size=" + this.rows + "&page=" + this.page).subscribe({
      next: (data: any) => {
        this.datos = data;
      },
      error: (error: any) => {
        this.datos = null;
        console.log(error);
      }

    })
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = event.page;
    this.getPage();
  }



}
