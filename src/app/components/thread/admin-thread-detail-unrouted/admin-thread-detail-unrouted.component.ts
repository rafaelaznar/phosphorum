import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-thread-detail-unrouted',
  templateUrl: './admin-thread-detail-unrouted.component.html',
  styleUrls: ['./admin-thread-detail-unrouted.component.css']
})
export class AdminThreadDetailUnroutedComponent implements OnInit {


  @Input() id: number = 1;
  datos: any = null;

  constructor(
    private oHttpClient: HttpClient
  ) { }

  ngOnInit() {
    this.getOne();
  }

  getOne(): void {
    this.oHttpClient.get("http://localhost:8083/thread/" + this.id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.datos = data;
      },
      error: (error: any) => {
        this.id = 0;
        console.log(error);
      }

    })

  }

}
