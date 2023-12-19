import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { IUser, IUserPage } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
//Import para graphics
import { Chart } from 'chart.js';
//Modified by p
@Component({
  selector: 'app-user-user-featured-unrouted',
  templateUrl: './user-user-featured-unrouted.component.html',
  styleUrls: ['./user-user-featured-unrouted.component.css']
})

export class UserUserFeaturedUnroutedComponent implements OnInit {

  oPage: IUserPage | undefined;
  oPaginatorState: PaginatorState = { first: 0, rows: 100, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oUserToRemove: IUser | null = null;

  //Almacena Usuarios con más respuestas
  topUsers: IUser[] = [];

  constructor(
    private oUserAjaxService: UserAjaxService,
  ) { }

  ngOnInit() {
    this.getPage();
  }

  getPage(): void {
    this.oUserAjaxService.getPageByRepliesNumberDesc(this.oPaginatorState.rows, this.oPaginatorState.page).subscribe({
      next: (data: IUserPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        // Almacena los 5 primeros usuarios en la nueva variable
        this.topUsers = data.content.slice(0, 5);
        // Llama a la función para crear el gráfico
        this.createDonutChart();
        console.log(this.oPaginatorState);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    })
  }
 // Función para crear el gráfico donut
 createDonutChart(): void {
  const ctx = document.getElementById('donutChart') as HTMLCanvasElement;
  const donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: this.topUsers.map((user) => user.username),
      datasets: [
        {
          data: this.topUsers.map((user) => user.replies),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
          ],
        },
      ],
    },
  });
}
}
