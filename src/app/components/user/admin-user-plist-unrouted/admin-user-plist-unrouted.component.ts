import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-user-plist-unrouted',
  templateUrl: './admin-user-plist-unrouted.component.html',
  styleUrls: ['./admin-user-plist-unrouted.component.css']
})
export class AdminUserPlistUnroutedComponent implements OnInit {

  datos: any = [];
  size: number = 10;

  constructor(
    private oHttpClient: HttpClient
  ) { }

  ngOnInit() {
    this.getPage();
  }

  getPage(): void {
    this.oHttpClient.get("http://localhost:8083/user" + "?size=" + this.size).subscribe({
      next: (data: any) => {
        this.datos = data;
      },
      error: (error: any) => {
        this.datos = null;
        console.log(error);
      }

    })
  }

  onChangeRPP() {    
    this.getPage();
  }



}
