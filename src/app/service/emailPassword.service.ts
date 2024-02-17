import { Observable } from 'rxjs';
import { EmailValuesDto } from './../model/model.emailValuesDto';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ChangePasswordDto } from '../model/model.changePasswordDto';

@Injectable({
  providedIn: "root"
})

export class EmailPasswordService {  
    constructor(
        private oHttpClient: HttpClient
    ) { 

    }

     changePasswordUrl: string = "http://localhost:8083/email/";
    
    public sendEmail(oEmailValuesDto: EmailValuesDto): Observable<any>{
        return this.oHttpClient.post<any>(this.changePasswordUrl + 'recover-password', oEmailValuesDto);
    }

    public changePassword(oEmailValuesDto: ChangePasswordDto): Observable<any>{
        return this.oHttpClient.post<any>(this.changePasswordUrl + 'change-password', oEmailValuesDto);
    }

}