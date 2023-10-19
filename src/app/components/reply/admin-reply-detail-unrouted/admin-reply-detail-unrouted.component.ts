import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-reply-detail-unrouted',
  templateUrl: './admin-reply-detail-unrouted.component.html',
  styleUrls: ['./admin-reply-detail-unrouted.component.css']
})
export class AdminReplyDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  datos: any = null;

  constructor(
    private oHttpClient: HttpClient
  ) { }

  ngOnInit() {
    this.getOne();
  }

  getOne(): void {
    this.oHttpClient.get("http://localhost:8083/reply/" + this.id).subscribe({
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
