import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IReply, IThread, IUser, formOperation } from 'src/app/model/model.interfaces';
import { ReplyAjaxService } from 'src/app/service/reply.ajax.service.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-user-reply-form-unrouted',
  templateUrl: './user-reply-form-unrouted.component.html',
  styleUrls: ['./user-reply-form-unrouted.component.css']
})

export class UserReplyFormUnroutedComponent implements OnInit {

  replyForm!: FormGroup;
  oReply: IReply = { creation: new Date(Date.now()), user: { id: 0 }, thread: { id: 0 } } as IReply;
  status: HttpErrorResponse | null = null;
  //---
  id: number = 0;
  id_thread: number = 0;
  operation: formOperation = 'NEW'; // new or edit

  constructor(
    private formBuilder: FormBuilder,
    private oReplyAjaxService: ReplyAjaxService,
    private matSnackBar: MatSnackBar,
    public oDialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef,
    public oDynamicDialogConfig: DynamicDialogConfig,
    private oTranslocoService: TranslocoService
  ) {
    if (oDynamicDialogConfig) {
      if (oDynamicDialogConfig.data) {
        if (oDynamicDialogConfig.data.id) {
          this.oReply.id = oDynamicDialogConfig.data.id;
        } else {
          this.oReply.id = 0;
        }
        if (oDynamicDialogConfig.data.id_thread) {
          this.oReply.thread = { id: oDynamicDialogConfig.data.id_thread } as IThread;
        } else {
          this.oReply.thread = {} as IThread;
        }
        if (oDynamicDialogConfig.data.operation) {
          this.operation = oDynamicDialogConfig.data.operation;
        } else {
          this.operation = 'NEW';
        }
      }
    }
    this.initializeForm(this.oReply);

  }

  // FORMULARIO PARA CREAR UN REPLY
  initializeForm(oReply: IReply) {
    this.replyForm = this.formBuilder.group({
      id: [oReply.id],
      title: [oReply.title, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      body: [oReply.body, [Validators.required, Validators.maxLength(1000)]],
      creation: [new Date(oReply.creation), [Validators.required]],
      user: this.formBuilder.group({
        id: [oReply.user.id, Validators.required]
      }),
      thread: this.formBuilder.group({
        id: [oReply.thread.id, Validators.required]
      })
    });
  }


  // Inicializa el formulario
  // Comprueba si la operación es editar o crear
  // Si es editar, recupera el reply del servidor y lo muestra en el formulario
  // Si es crear, inicializa el formulario con un reply vacío
  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oReplyAjaxService.getOne(this.id).subscribe({
        next: (data: IReply) => {
          this.oReply = data;
          this.initializeForm(this.oReply);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.matSnackBar.open(this.oTranslocoService.translate('global.error') + ' ' + this.oTranslocoService.translate('global.reading') + ' ' + this.oTranslocoService.translate('reply.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.from-server') + '.', '', { duration: 2000 });
        }
      });
    } else {
      this.initializeForm(this.oReply);
    }
  }

  // Comprueba si un campo del formulario tiene un error
  public hasError = (controlName: string, errorName: string) => {
    return this.replyForm.controls[controlName].hasError(errorName);
  }

  // Comprueba si el formulario es válido
  // Si es válido, envía el reply al servidor
  // Si no es válido, muestra un mensaje de error
  // Si la operación es crear, muestra un mensaje de creación correcta
  // Si la operación es editar, muestra un mensaje de edición correcta
  // Cierra el diálogo
  onSubmit() {
    if (this.replyForm.valid) {
      if (this.operation == 'NEW') {
        this.oReplyAjaxService.newOne(this.replyForm.value).subscribe({
          next: (data: IReply) => {
            this.oReply = { "user": {}, "thread": {} } as IReply;
            this.initializeForm(this.oReply);
            this.matSnackBar.open(this.oTranslocoService.translate('global.the.fem') + ' ' + this.oTranslocoService.translate('reply.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.create.has.fem') + '.', '', { duration: 2000 });
            this.oDynamicDialogRef.close(data);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.matSnackBar.open(this.oTranslocoService.translate('global.the.fem') + ' ' + this.oTranslocoService.translate('reply.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.create.hasnt.fem') + '.', '', { duration: 2000 });
          }
        });
      } else {
        this.oReplyAjaxService.updateOne(this.replyForm.value).subscribe({
          next: (data: IReply) => {
            this.oReply = data;
            this.initializeForm(this.oReply);
            this.matSnackBar.open(this.oTranslocoService.translate('global.the.fem') + ' ' + this.oTranslocoService.translate('reply.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.update.has.fem') + '.', '', { duration: 2000 });
            this.oDynamicDialogRef.close(data);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.matSnackBar.open(this.oTranslocoService.translate('global.the.fem') + ' ' + this.oTranslocoService.translate('reply.lowercase.singular') + ' ' + this.oTranslocoService.translate('global.update.has.fem') + '.', '', { duration: 2000 });
          }
        });
      }
    }
  }


}
