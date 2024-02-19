import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartComponent } from 'chart.js';
import { ReplyAjaxService } from 'src/app/service/reply.ajax.service.service';
//Modified by p
export type ChartOptions = {
  series: any[];
  chart: any;
  xaxis: any;
  title: any;
};

@Component({
  selector: 'app-admin-user-view-routed',
  templateUrl: './admin-user-view-routed.component.html',
  styleUrls: ['./admin-user-view-routed.component.css']
})

export class AdminUserViewRoutedComponent implements OnInit {

  id: number = 1;

 
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  status: HttpErrorResponse | null = null;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oReplyAjaxService: ReplyAjaxService,
    ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
    console.log('ID User:', this.id); // Agregar este registro
    // Obtener los datos de respuestas por mes del servicio ReplyAjaxService
    this.oReplyAjaxService.getRepliesByMonth(this.id).subscribe({
      next: (data: any) => {
        // Construir el gráfico con los datos obtenidos
        console.log('Data received:', data);
        const categories = Object.keys(data);
        const seriesData: (number | null)[] = Object.values(data).map((monthData: any) => monthData as number);

        this.chartOptions = {
          series: [
            {
              name: "Number of Replies",
              data: seriesData
            }
          ],
          chart: {
            height: 350,
            type: "line"
          },
          title: {
            text: "User Replies by Month"
          },
          xaxis: {
            categories: categories.map(month => month.charAt(0) + month.slice(1).toLowerCase())
          }
        };
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching data:', error);
        console.error('Error body:', error.error);
      
      }
    });
  }

}
