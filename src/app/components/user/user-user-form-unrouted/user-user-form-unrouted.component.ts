import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUser, formOperation } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

@Component({
  selector: 'app-user-user-form-unrouted',
  templateUrl: './user-user-form-unrouted.component.html',
  styleUrls: ['./user-user-form-unrouted.component.css']
})
export class UserUserFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; //new or edit

  userForm!: FormGroup;
  oUser: IUser = {} as IUser;
  status: HttpErrorResponse | null = null;

  constructor(
    private oFormBuilder: FormBuilder,
    private oUserAjaxService: UserAjaxService,
    private oRouter: Router,
    private oMatSnackBar: MatSnackBar
  ) {
    this.initializeForm(this.oUser);
  }

  initializeForm(oUser: IUser) {
    this.userForm = this.oFormBuilder.group({
      id: [oUser.id],
      name: [oUser.name, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      surname: [oUser.surname, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      lastname: [oUser.lastname, Validators.maxLength(255)],
      email: [oUser.email, [Validators.required, Validators.email]],
      username: [oUser.username, [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9]+$')]],
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oUserAjaxService.getOne(this.id).subscribe({
        next: (data: IUser) => {
          this.oUser = data;
          this.initializeForm(this.oUser);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open("Error reading user from server.", '', { duration: 2000 });
        }
      })
    } else {
      this.initializeForm(this.oUser);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.userForm.valid) {
      if (this.operation == 'NEW') {
        this.oUserAjaxService.newOneForUsers(this.userForm.value).subscribe({
          next: (data: IUser) => {
            this.oUser = data;
            this.initializeForm(this.oUser);
            // avisar al usuario que se ha creado correctamente
            this.oMatSnackBar.open("User has been created.", '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'user', 'view', this.oUser]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open("Can't create user.", '', { duration: 2000 });
          }
        })

      }
    }
  }


}
