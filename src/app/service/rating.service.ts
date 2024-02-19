import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { API_URL } from 'src/environment/environment';
import { IRating, IRatingPage } from '../model/model.interfaces';

@Injectable({
  providedIn: 'root'
})
export class RatingAjaxService {

  private ratingUrl = API_URL + "/rating";
  public dialogClosed = new EventEmitter<void>();

  constructor(
    private oHttpClient: HttpClient
  ) { }

  // ADMIN METHODS MODULE
  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, id_user: number, id_reply: number): Observable<IRatingPage> {
    if (!size) size = 10;
    if (!page) page = 0;
    return this.oHttpClient.get<IRatingPage>(this.ratingUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection);
  }

  getOne(id: number): Observable<IRating> {
    return this.oHttpClient.get<IRating>(this.ratingUrl + id);
  }

  newOne(oRating: IRating): Observable<IRating> {
    return this.oHttpClient.post<IRating>(this.ratingUrl, oRating);
  }

  updateOne(oRating: IRating): Observable<IRating> {
    return this.oHttpClient.put<IRating>(this.ratingUrl, oRating);
  }

  removeOne(id: number | undefined): Observable<number> {
    if (id) {
      return this.oHttpClient.delete<number>(this.ratingUrl + "/" + id);
    } else {
      return new Observable<number>();
    }
  }

  generateRandom(amount: number): Observable<number> {
    return this.oHttpClient.post<number>(this.ratingUrl + "/populate/" + amount, null);
  }

  empty(): Observable<number> {
    return this.oHttpClient.delete<number>(this.ratingUrl + "/empty");
  }

  // RATING METHODS MODULE
  // Método para valorar una respuesta
  rateReply(rating: IRating): Observable<IRating> {
    // Realiza la solicitud de creación de la valoración
    return this.oHttpClient.post<IRating>(this.ratingUrl, rating).pipe(
      catchError((error) => {
        console.error('Error while submitting rating:', error);
        throw 'Error while submitting rating.';
      })
    );
  }

  // Devuelve un observable que emite un objeto de tipo Map con el promedio de valoraciones para todas las respuestas
  getAverageRatingForAllReplies(): Observable<Map<number, number>> {
    return this.oHttpClient.get<Map<number, number>>(`${this.ratingUrl}/average/all`);
  }

  // Devuelve un observable que emite un objeto de tipo Map con el número de valoraciones para todas las respuestas
  getRatingCountForAllReplies(): Observable<Map<number, number>> {
    return this.oHttpClient.get<Map<number, number>>(`${this.ratingUrl}/count/all`);
  }

  // Borra una valoración
  deleteRating(replyId: number): Observable<void> {
    return this.oHttpClient.delete<void>(`${this.ratingUrl}/delete/${replyId}`);
  }

  // Devuelve un observable que emite un objeto de tipo Map con todas las valoraciones
  getAllIds(): Observable<IRating[]> {
    return this.oHttpClient.get<IRating[]>(this.ratingUrl + "/allIds");
  }

  // Emite el evento al cerrar el diálogo en user-reply-rating-form-unrouted.component.ts
  emitDialogClosed() {
    this.dialogClosed.emit();
  }

}

// Path: src/app/service/reply.service.ts