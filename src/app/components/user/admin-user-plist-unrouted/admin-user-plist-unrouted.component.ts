import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IUser, IUserPage } from 'src/app/model/model.interfaces';
import { AdminUserDetailUnroutedComponent } from '../admin-user-detail-unrouted/admin-user-detail-unrouted.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-user-plist-unrouted',
  templateUrl: './admin-user-plist-unrouted.component.html',
  styleUrls: ['./admin-user-plist-unrouted.component.css']
})

export class AdminUserPlistUnroutedComponent implements OnInit {

  oPage: any = [];
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;

  constructor(
    private oHttpClient: HttpClient,
    public dialogService: DialogService,
    public messageService: MessageService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getPage();
  }

  getPage(): void {
    this.oHttpClient.get<IUserPage>("http://localhost:8083/user" + "?size=" + this.oPaginatorState.rows + "&page=" + this.oPaginatorState.page + "&sort=" + this.orderField + "," + this.orderDirection).subscribe({
      next: (data: IUserPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        console.log(this.oPaginatorState);
      },
      error: (error: HttpErrorResponse) => {
        this.oPage.error = error;
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

  ref: DynamicDialogRef | undefined;

  goToView(u: IUser) {
    this.ref = this.dialogService.open(AdminUserDetailUnroutedComponent, {
      data: {
        id: u.id
      },
      header: 'View of user',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
  }

  // Este método manejará el borrado de usuarios
  deleteUser(userId: number) {
    // Realiza una solicitud de borrado al servidor
    this.oHttpClient.delete(`http://localhost:8083/user/${userId}`)
      .subscribe({
        next: () => {
          // Borrado exitoso
          console.log(`Usuario con ID ${userId} borrado correctamente.`);
          
          // Luego de borrar el usuario, puedes actualizar la lista de usuarios volviendo a llamar a getPage()
          this.getPage();
        },
        error: (error: HttpErrorResponse) => {
          console.error(`Error al borrar el usuario con ID ${userId}.`, error);
          // Manejo de errores, muestra notificaciones o toma acciones apropiadas
        }
      });
  }

  openDeleteConfirmationDialog(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Borrado',
        message: '¿Estás seguro de que deseas borrar este usuario? Esta acción no se puede deshacer.'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(userId);
      }
    });
  }
}
