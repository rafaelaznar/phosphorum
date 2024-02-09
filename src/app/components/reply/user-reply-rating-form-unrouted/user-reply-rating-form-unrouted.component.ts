import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IRating, IReply, IThread, IUser, formOperation } from 'src/app/model/model.interfaces';
import { RatingAjaxService } from 'src/app/service/rating.service';
import { ReplyAjaxService } from 'src/app/service/reply.ajax.service.service';
import { ThreadAjaxService } from 'src/app/service/thread.ajax.service.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

@Component({
  selector: 'app-user-reply-rating-form-unrouted',
  templateUrl: './user-reply-rating-form-unrouted.component.html',
  styleUrls: ['./user-reply-rating-form-unrouted.component.css']
})
export class UserReplyRatingFormUnroutedComponent implements OnInit {


  threadId: number | undefined;
  replyId: number | undefined;
  userId: number | undefined;
  user: IUser | undefined;
  thread: IThread | undefined;
  reply: IReply | undefined;
  status: HttpErrorResponse | null = null;
  oRating: IRating = { user: { id: 0 }, reply: { id: 0 }, stars: 1, created_at: new Date(Date.now()) } as IRating;
  starSelected: boolean = false;
  ratingForm!: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private oRatingAjaxService: RatingAjaxService,
    private oUserAjaxService: UserAjaxService,
    private oThreadAjaxService: ThreadAjaxService,
    private oReplyAjaxService: ReplyAjaxService,
    private matSnackBar: MatSnackBar,
    public oDialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef,
    public oDynamicDialogConfig: DynamicDialogConfig
  ) {
    this.userId = this.oDynamicDialogConfig.data.userId;
    this.threadId = this.oDynamicDialogConfig.data.threadId;
    this.replyId = this.oDynamicDialogConfig.data.replyId;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.ratingForm.controls[controlName].hasError(errorName);
  }

  // Se ejecuta al inicializar el formulario
  ngOnInit() {
    if (this.userId !== undefined) {
      this.oUserAjaxService.getOne(this.userId).subscribe((user: IUser) => {
        this.user = user;
      });
    }
    if (this.threadId !== undefined) {

      this.oThreadAjaxService.getOne(this.threadId).subscribe((thread: IThread) => {
        this.thread = thread;
      });
    }
    if (this.replyId !== undefined) {

      this.oReplyAjaxService.getOne(this.replyId).subscribe((reply: IReply) => {
        this.reply = reply;
      });
    }
    this.initializeForm(this.oRating);
    // Retorna un observable que emite un nuevo valor cada vez que el valor del formulario cambiado
    // Permite comprobar si se ha seleccionado al menos una estrella y cambiar la puntuación y que quede guardada
    this.ratingForm.valueChanges.subscribe(() => {
      this.starSelected = this.ratingForm.valid;
      console.log("starSelected:", this.starSelected); // true or false
      console.log("Valoración:", this.ratingForm.value.stars);
    });
  }

  // Inicializa el formulario y guarda los datos de la valoración
  initializeForm(oRating: IRating) {
    this.ratingForm = this.formBuilder.group({
      id: [oRating.id],
      user: this.formBuilder.group({
        id: [this.userId],
      }),
      thread: this.formBuilder.group({
        id: [this.threadId]
      }),
      reply: this.formBuilder.group({
        id: [this.replyId]
      }),
      stars: [oRating.stars, [Validators.required, Validators.min(1), Validators.max(5)]],
      created_at: [new Date(oRating.created_at)]
    });
  }


  // Obtiene los datos de la valoración del formulario
  onSubmit() {
    const ratingData = this.ratingForm.value;
    // Llama al servicio para verificar la existencia de la valoración
    this.oRatingAjaxService.rateReply(ratingData).subscribe({
      next: (data: IRating) => {
        this.matSnackBar.open("Rating has been published.", '', { duration: 2000 });
        this.ratingForm.reset();
        // Cierra el diálogo y emitir el evento al cerrar el diálogo
        this.oDynamicDialogRef.close(data);
        this.oRatingAjaxService.emitDialogClosed();
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
        this.matSnackBar.open("Error submitting rating.", '', { duration: 2000 });
      }
    });
  }

  // Cierra el formulario sin guardar cambios porque
  // termina la suscripción al evento valueChanges
  onCancel() {
    this.oDynamicDialogRef.close();
  }
}



