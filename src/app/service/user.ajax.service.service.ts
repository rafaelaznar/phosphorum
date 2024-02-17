import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, IUserPage } from '../model/model.interfaces';
import { API_URL } from 'src/environment/environment';

@Injectable()
export class UserAjaxService {

    sUrl: string = API_URL + "/user";

    constructor(
        private oHttpClient: HttpClient
    ) { }


    getOne(id: number): Observable<IUser> {
        return this.oHttpClient.get<IUser>(this.sUrl + "/" + id);
    }

    getByUsername(username: string): Observable<IUser> {
        return this.oHttpClient.get<IUser>(this.sUrl + "/byUsername/" + username);
    }

    getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, strFilter?: string): Observable<IUserPage> {
        let sUrl_filter: string;
        if (!size) size = 10;
        if (!page) page = 0;    
        if (strFilter && strFilter.trim().length > 0) {
            sUrl_filter = `&filter=${strFilter}`;
        } else {
            sUrl_filter = "";
        }
        return this.oHttpClient.get<IUserPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + sUrl_filter);
    }

    removeOne(id: number | undefined): Observable<number> {
        if (id) {
            return this.oHttpClient.delete<number>(this.sUrl + "/" + id);
        } else {
            return new Observable<number>();
        }
    }

    newOne(oUser: IUser): Observable<IUser> {
        return this.oHttpClient.post<IUser>(this.sUrl, oUser);
    }

    newOneForUsers(oUser: IUser): Observable<IUser> {
        return this.oHttpClient.post<IUser>(this.sUrl + "/forusers", oUser);
    }

    updateOne(oUser: IUser): Observable<IUser> {
        return this.oHttpClient.put<IUser>(this.sUrl, oUser);
    }

    generateRandom(amount: number): Observable<number> {
        return this.oHttpClient.post<number>(this.sUrl + "/populate/" + amount, null);
    }

    getPageByRepliesNumberDesc(size: number | undefined, page: number | undefined): Observable<IUserPage> {
        if (!size) size = 10;
        if (!page) page = 0;
        return this.oHttpClient.get<IUserPage>(this.sUrl + "/byRepliesNumberDesc?size=" + size + "&page=" + page);
    }

    empty(): Observable<number> {
        return this.oHttpClient.delete<number>(this.sUrl + "/empty");
    }

    confirmAccount(token: string, pass:string): Observable<string> {
        
        return this.oHttpClient.get<string>(this.sUrl + "/confirm-account?token=" + token + "&password=" + pass);
      }

}
