import { Component, OnInit, Input, Optional } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IThread } from 'src/app/model/model.interfaces';


@Component({
  selector: 'app-admin-thread-detail-unrouted',
  templateUrl: './admin-thread-detail-unrouted.component.html',
  styleUrls: ['./admin-thread-detail-unrouted.component.css']
})
export class AdminThreadDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;

  oThread: IThread = {} as IThread;
  status: HttpErrorResponse | null = null;

  constructor(
    private oHttpClient: HttpClient,
    @Optional() public ref:DynamicDialogRef,
    @Optional() public config:DynamicDialogConfig
  ) { 
    if (config){
      if (config.data){
        this.id = config.data.id;
      }
    }    
  }

  ngOnInit() {
    this.getOne();
  }

  getOne(): void {
    this.oHttpClient.get<IThread>("http://localhost:8083/thread/" + this.id).subscribe({
      next: (data: IThread) => {
        this.oThread = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })

  }

}
