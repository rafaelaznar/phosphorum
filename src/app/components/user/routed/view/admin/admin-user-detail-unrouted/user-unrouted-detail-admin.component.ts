import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

interface IUser {
  id: number;
  name: string;
  surname: string;
  lastname: string;
  email: string;
  username: string;
  role: boolean;
  threads: number;
  replies: number
}


@Component({
  selector: 'app-user-unrouted-detail-admin',
  templateUrl: './user-unrouted-detail-admin.component.html',
  styleUrls: ['./user-unrouted-detail-admin.component.css']
})
export class UserUnroutedDetailAdminComponent implements OnInit {

 
  @Input() id: number = 1;

  datos: IUser = { id: 0, name: "", surname: "", lastname: "", email: "", username: "", role: false, threads: 0, replies: 0 };
  //id: number = 1;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
  }


  cargar(): void {
    console.log("Cargando AJAX...");

    this.http.get("http://localhost:8083/user/" + this.id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.datos = data;
      },
      error: (error: any) => {
        console.log(error);
      }

    })

  }

}
