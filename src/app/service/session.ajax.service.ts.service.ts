import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { API_URL } from 'src/environment/environment';



export interface SessionEvent {
    type: string;
}



@Injectable()
export class SessionAjaxService {

    sUrl: string = API_URL + "/session";

    subjectSession = new Subject<SessionEvent>();

    constructor(
        private oHttpClient: HttpClient
    ) { }

    login(sUsername: string, sPassword: string): Observable<string> {
        //const sUser: string = JSON.stringify({ username: sUsername, password: sPassword });
        return this.oHttpClient.post<string>(this.sUrl, { username: sUsername, password: sPassword });
    }

    setToken(sToken: string): void {
        localStorage.setItem('token', sToken);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isSessionActive(): Boolean {
        //pte comprobar que el token no está caducado
        return this.getToken() != null;
    }

    getUsername(): string {
        if (this.isSessionActive()) {
            let token: string | null = localStorage.getItem('token');
            if (!token) {
                return "";
            } else {
                return JSON.parse(atob(token.split('.')[1])).username;
            }
        } else {
            return "";
        }
    }




}
