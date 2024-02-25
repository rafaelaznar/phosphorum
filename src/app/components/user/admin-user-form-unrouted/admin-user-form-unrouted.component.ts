import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUser, formOperation } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { TranslocoService } from '@ngneat/transloco';
import { MediaService } from 'src/app/service/media.service';

@Component({
  selector: 'app-admin-user-form-unrouted',
  templateUrl: './admin-user-form-unrouted.component.html',
  styleUrls: ['./admin-user-form-unrouted.component.css']
})
export class AdminUserFormUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; //new or edit

  userForm!: FormGroup;
  oUser: IUser = {} as IUser;
  status: HttpErrorResponse | null = null;

  constructor(
    private oFormBuilder: FormBuilder,
    private oUserAjaxService: UserAjaxService,
    private oRouter: Router,
    private oMatSnackBar: MatSnackBar,
    private oTranslocoService: TranslocoService,
    private mediaService: MediaService
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
      role: [oUser.role, Validators.required],
      profileImageUrl: [oUser.profileImageUrl]
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oUserAjaxService.getOne(this.id).subscribe({
        next: (data: IUser) => {
          this.oUser = data;
          // Establecer la URL de la imagen si existe en el formulario
          if (this.oUser.profileImageUrl) {
            this.userForm.get('profileImageUrl')?.setValue(this.oUser.profileImageUrl);
          }
          this.initializeForm(this.oUser);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open(this.oTranslocoService.translate('global.error') + ' ' + this.oTranslocoService.translate('global.reading') + ' ' + this.oTranslocoService.translate('user.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.from-server'), '', { duration: 2000 });
        }
      });
    } else {
      this.initializeForm(this.oUser);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  upload(event: any) {
    const file = event.target.files[0];
  
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      this.mediaService.uploadFile(formData).subscribe(response => {
        this.oUser.profileImageUrl = response.url;
  
        // Actualizar el campo 'profileImageUrl' en el formulario userForm
        this.userForm.patchValue({
          profileImageUrl: response.url
        });
      });
    }
  }

  removeProfileImage() {
    this.userForm.get('profileImageUrl')!.setValue('http://localhost:8083/media/default.png');
  }

  onSubmit() {
    if (this.userForm.valid) {
      if (this.operation == 'NEW') {
        this.oUserAjaxService.newOne(this.userForm.value).subscribe({
          next: (data: IUser) => {
            this.oUser = data;
            this.initializeForm(this.oUser);
            // avisar al usuario que se ha creado correctamente
            this.oMatSnackBar.open(this.oTranslocoService.translate('global.the.masc') + ' ' + this.oTranslocoService.translate('user.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.create.has.masc'), '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'user', 'view', this.oUser]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open(this.oTranslocoService.translate('global.the.masc') + ' ' + this.oTranslocoService.translate('user.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.create.hasnt.masc'), '', { duration: 2000 });
          }
        })

      } else {
        this.oUserAjaxService.updateOne(this.userForm.value).subscribe({
          next: (data: IUser) => {
            this.oUser = data;
            this.initializeForm(this.oUser);
            // avisar al usuario que se ha actualizado correctamente
            this.oMatSnackBar.open(this.oTranslocoService.translate('global.the.masc') + ' ' + this.oTranslocoService.translate('user.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.update.has.masc'), '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'user', 'view', this.oUser.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open(this.oTranslocoService.translate('global.the.masc') + ' ' + this.oTranslocoService.translate('user.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.update.hasnt.masc'), '', { duration: 2000 });
          }
        })
      }
    }
  }

}
