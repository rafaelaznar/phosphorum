import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReply, IReplyPage } from '../model/model.interfaces';
import { API_URL } from 'src/environment/environment';

@Injectable()
export class ReplyAjaxService {

    sUrl: string = API_URL + "/reply";

    constructor(
        private oHttpClient: HttpClient
    ) { }

    getOne(id: number): Observable<IReply> {
        return this.oHttpClient.get<IReply>(this.sUrl + "/" + id);
    }

    getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string): Observable<IReplyPage> {
        if (!size) size = 10;
        if (!page) page = 0;
        return this.oHttpClient.get<IReplyPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection);
    }

    removeOne(id: number | undefined): Observable<number> {
        if (id) {
            return this.oHttpClient.delete<number>(this.sUrl + "/" + id);
        } else {
            return new Observable<number>();
        }
    }

    newOne(oThread: IReply): Observable<IReply> {
        return this.oHttpClient.post<IReply>(this.sUrl, oThread);
    }

    updateOne(oThread: IReply): Observable<IReply> {
        return this.oHttpClient.put<IReply>(this.sUrl, oThread);
    }

}
