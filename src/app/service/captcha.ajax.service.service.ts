import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/environment/environment';
import { ICaptcha } from '../model/model.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CaptchaAjaxService {

  sUrl: string = API_URL + "/captcha";

constructor(
  private oHttpClient: HttpClient
) { }

generateOneRandom(): Observable<ICaptcha>  {
  return this.oHttpClient.get<ICaptcha>(this.sUrl + "/random");
}

}
