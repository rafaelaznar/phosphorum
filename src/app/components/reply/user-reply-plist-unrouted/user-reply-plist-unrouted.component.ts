import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IRating, IRatingPage, IReply, IReplyPage, IThread, IUser } from 'src/app/model/model.interfaces';
import { AdminReplyDetailUnroutedComponent } from '../admin-reply-detail-unrouted/admin-reply-detail-unrouted.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplyAjaxService } from 'src/app/service/reply.ajax.service.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { ThreadAjaxService } from 'src/app/service/thread.ajax.service.service';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.ts.service';
import { UserReplyFormUnroutedComponent } from '../user-reply-form-unrouted/user-reply-form-unrouted.component';
import { UserThreadFormUnroutedComponent } from '../../thread/user-thread-form-unrouted/user-thread-form-unrouted.component';
import { UserReplyRatingFormUnroutedComponent } from '../user-reply-rating-form-unrouted/user-reply-rating-form-unrouted.component';
import { RatingAjaxService } from 'src/app/service/rating.service';
import { Observable } from 'rxjs';


@Component({
  providers: [ConfirmationService],
  selector: 'app-user-reply-plist-unrouted',
  templateUrl: './user-reply-plist-unrouted.component.html',
  styleUrls: ['./user-reply-plist-unrouted.component.css']
})

export class UserReplyPlistUnroutedComponent implements OnInit {

  id_thread_filter: number = 0;
  id_user_filter: number = 0;

  oPage: IReplyPage | undefined;
  oUser: IUser | null = null;
  oThread: IThread | null = null;
  oReply: IReply | null = null;
  oRating: IRating | null = null;
  orderField: string = "id";
  orderDirection: string = "desc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oReplyToRemove: IReply | null = null;


  userRatings: IRating[] = [];
  averageRatings: any = {};
  ratingCount: any = {};
  userRatedReplyIds: Set<number> = new Set<number>();
  oRatingToRemove: IRating | null = null;


  @Output() reply_change = new EventEmitter<Boolean>();
  ref: DynamicDialogRef | undefined;

  constructor(
    private oRatingAjaxService: RatingAjaxService,
    private oUserAjaxService: UserAjaxService,
    public oSessionService: SessionAjaxService,
    private oThreadAjaxService: ThreadAjaxService,
    private oReplyAjaxService: ReplyAjaxService,
    public oDialogService: DialogService,
    private oConfirmationService: ConfirmationService,
    private oMatSnackBar: MatSnackBar
  ) { }

  // Llama al método para obtener la página de respuestas
  // Llama al método para calcular y obtener las calificaciones promedio para todas las respuestas
  ngOnInit() {
    this.getPage();
    if (this.id_user > 0) {
      this.getUser();
    }
    if (this.id_thread > 0) {
      this.getThread();
    }
    this.calculateAverageRatingsForAllReplies();
    this.getAllIds();
  }

  @Input()
  set id_user(value: number) {
    if (value) {
      this.id_user_filter = value;
    } else {
      this.id_user_filter = 0;
    }
    this.getPage();
  }
  get id_user(): number {
    return this.id_user_filter;
  }

  @Input()
  set id_thread(value: number) {
    if (value) {
      this.id_thread_filter = value;
      this.getThread();
    } else {
      this.id_thread_filter = 0;
    }
    this.getPage();
  }
  get id_thread(): number {
    return this.id_thread_filter;
  }

  getUser(): void {
    this.oUserAjaxService.getOne(this.id_user).subscribe({
      next: (data: IUser) => {
        this.oUser = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error getting user:', error);
      }
    });
  }

  getThread(): void {
    this.oThreadAjaxService.getOne(this.id_thread).subscribe({
      next: (data: IThread) => {
        this.oThread = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error getting thread:', error);
      }
    });
  }

  // Llama al método para obtener la página de respuestas
  getPage(): void {
    this.oReplyAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_user_filter, this.id_thread_filter).subscribe({
      next: (data: IReplyPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    })
  }

  onPageChang(event: PaginatorState) {
    this.oPaginatorState.rows = event.rows;
    this.oPaginatorState.page = event.page;
    this.getPage();
  }

  postNewReply(): void {
    if (this.id_thread_filter > 0 && this.oSessionService.isSessionActive()) {

      this.ref = this.oDialogService.open(UserReplyFormUnroutedComponent, {
        data: {
          id_thread: this.id_thread_filter,
        },
        header: 'Post a new reply',
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
      });
      this.ref.onClose.subscribe((nReply: number) => {
        this.getPage();
        this.reply_change.emit(true);
      });
    }
  }

  postNewThread(): void {
    if (this.id_thread_filter > 0 && this.oSessionService.isSessionActive()) {

      this.ref = this.oDialogService.open(UserThreadFormUnroutedComponent, {
        data: {
          id_thread: this.id_thread_filter,
        },
        header: 'Post a new thread',
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
      });
      this.ref.onClose.subscribe((nThread: number) => {
        this.getPage();
        this.reply_change.emit(true);
      });
    }
  }

  doRemove(u: IReply) {
    this.oReplyToRemove = u;
    this.oConfirmationService.confirm({
      accept: () => {
        this.oMatSnackBar.open("The reply has been removed.", '', { duration: 2000 });
        this.oReplyAjaxService.removeOne(this.oReplyToRemove?.id).subscribe({
          next: () => {
            this.getPage();
            this.reply_change.emit(true);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open("The reply hasn't been removed.", "", { duration: 2000 });
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.oMatSnackBar.open("The reply hasn't been removed.", "", { duration: 2000 });
      }
    });
  }

  doView(u: IReply) {
    this.ref = this.oDialogService.open(AdminReplyDetailUnroutedComponent, {
      data: {
        id: u.id
      },
      header: 'View of reply',
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: false
    });
  }


  // MODULO VALORACIONES
  // Método para abrir el formulario de valoración de respuestas
  // Obtiene el ID del hilo y el ID de la respuesta
  // Obtiene el ID del usuario logueado usando el servicio de sesión
  async postRatingReply(reply: IReply): Promise<void> {
    const threadId = reply.thread.id;
    const replyId = reply.id;

    try {
      const userId = await this.oSessionService.getUserId().toPromise()// Obtener el ID del usuario logeado y se asigna cuando se resuelve la promesa
      console.log("User id logged:", userId);
      console.log("Reply id to rate: ", replyId);

      // Verifica si el usuario está logueado
      if (userId !== null) {
        // Abre el formulario de valoración de respuestas del componente user-reply-rating-form-unrouted
        // Asigna el ID del main thread, el ID del reply y el ID del usuario del reply para mostrarlos en el formulario
        this.ref = this.oDialogService.open(UserReplyRatingFormUnroutedComponent, {
          data: {
            threadId: threadId,
            replyId: replyId,
            userId: userId,
          },
          header: 'Rate this reply',
          width: '40%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: false
        });
        // Nos suscribimos al evento onClose para obtener los datos del formulario después de cerrarlo
        // Llama al método para calcular y obtener la media de las valoraciones
        // Escucha el emit y al cerrarse el formulario de valoración y actualiza la página 
        // Espera a que se cierre el formulario de valoración
        this.oRatingAjaxService.dialogClosed.subscribe(async () => {
          this.calculateAverageRatingsForAllReplies();
          await this.getAllIds();
        });
      } else {
        console.error('Could not retrieve the logged-in user ID');
      }
    } catch (error) {
      console.error('Error retrieving the logged-in user ID', error);
    }
  }


  // Método para calcular y obtener las calificaciones promedio para todas las respuestas del servidor
  calculateAverageRatingsForAllReplies(): void {
    this.oRatingAjaxService.getAverageRatingForAllReplies().subscribe( // 
      (averageMap: Map<number, number>) => {
        console.log('Media valoraciones por ID reply:', averageMap);
        // Asigna el Map de calificaciones promedio a la propiedad para mostrarlo en el HTML
        this.averageRatings = averageMap;
      },
      (error) => {
        console.error('Error obtaining average ratings:', error);
      }
    );
    // Llama al método para obtener el recuento de valoraciones para todas las respuestas del servidor
    this.oRatingAjaxService.getRatingCountForAllReplies().subscribe(
      (ratingCount: Map<number, number>) => {
        console.log('Número de votos por ID reply:', ratingCount);  // Do whatever is needed with the Map of counts
        this.ratingCount = ratingCount; // Assign the Map of counts to the property to display it in the HTML
      },
      (error) => {
        console.error('Error obtaining rating counts:', error);
      }
    );
  }

  // Método para redondear una calificación a un decimal
  roundRatingToOneDecimal(rating: number): number {
    return Math.round(rating * 10) / 10;
  }

  // Método para obtener todas las valoraciones y filtrarlas por el usuario logeado
  async getAllIds(): Promise<void> {
    try {
      const userId = await this.oSessionService.getUserId().toPromise();

      if (!userId) {
        console.error('User ID not available.');
        return;
      }

      const ratings = await this.oRatingAjaxService.getPage(undefined, undefined, '', '', userId, 0).toPromise();

      if (ratings && ratings.content) {
        console.log('Ratings for the current page:', ratings);
        console.log("User id:", userId);

        this.userRatings = ratings.content.filter(rating => rating.user.id === userId);
      } else {
        console.error('Unexpected response format:', ratings);
      }
    } catch (error) {
      console.error('Error getting ratings or user ID:', error);
    }
  }


  // Método para comprobar si el usuario ha valorado una respuesta
  hasUserRating(reply: IReply): boolean {
    // Utiliza el método some() en el array userRatings
    // some() devuelve true si hay al menos una valoración en userRatings
    // que tiene el mismo ID de respuesta que el ID de los replies del bucle
    return this.userRatings.some(rating => rating.reply.id === reply.id);
  }

  // Método borra la valoración de un usuario comparando el ID del usuario logeado 
  // con el ID del usuario que ha valorado la respuesta en la lista de valoraciones
  deleteUserRating(replyId: number): void {
    const ratingToDelete = this.userRatings.find(rating => rating.reply.id === replyId);

    if (ratingToDelete) {
      this.oRatingAjaxService.removeOne(ratingToDelete.id).subscribe(
        () => {
          // Actualiza la lista de valoraciones del usuario después de borrar
          this.getAllIds();
          this.calculateAverageRatingsForAllReplies();
          this.oMatSnackBar.open("Rating has been removed.", '', { duration: 2000 });
        },
        (error) => {
          console.error('Error deleting rating:', error);
        }
      );
    } else {
      console.error('Rating not found for the specified reply.');
    }
  }



}