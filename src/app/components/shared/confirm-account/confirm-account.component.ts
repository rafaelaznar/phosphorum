import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css']
})
export class ConfirmAccountComponent implements OnInit {

  constructor(
    private oRouter: ActivatedRoute,
    private oUserAjaxService: UserAjaxService,
    private oRouterNavigate: Router,
    private oMatSnackBar: MatSnackBar,
 
  ) { }

  ngOnInit() {
  }

  confirmAccount(): void {
    // Obtener el token de la URL
    const token = this.oRouter.snapshot.queryParams['token'];

    if (token) {
      this.oUserAjaxService.confirmAccount(token).subscribe({
        next: (data:string) => {
          console.log('Cuenta confirmada correctamente', data);
          this.oMatSnackBar.open(" Email verified!!", '', { duration: 2000 });

          this.oRouterNavigate.navigate(['/home']);
        },
        error:(error:HttpErrorResponse) => {
          console.error('Error al confirmar la cuenta', error);
        }
    });
    } else {
      console.error('Token no encontrado en la URL');
    }
  }

}
