import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IPrelogin } from 'src/app/model/model.interfaces';
import { CryptoService } from 'src/app/service/crypto.service';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.ts.service';
import { TranslocoService } from '@ngneat/transloco';
import { ReCaptcha2Component } from 'ngx-captcha';
import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-login-routed',
  templateUrl: './login-routed.component.html',
  styleUrls: ['./login-routed.component.css']
})

export class LoginRoutedComponent implements OnInit {

  // El decorador @ViewChild se utiliza para acceder a un componente hijo en el componente actual.
  // 'captchaElem' es un nombre de variable que se utiliza para referenciar el componente ReCaptcha2Component en el código del componente.
  @ViewChild('captchaElem') captchaElem!: ReCaptcha2Component;
  // Esto crea una propiedad 'captchaElem' en el componente actual, que se inicializará con la instancia del componente ReCaptcha2Component cuando Angular haya inicializado las vistas.
  // El símbolo '!' indica que estamos seguros de que este valor no será nulo después de la inicialización.


  loginForm: FormGroup;
  status: HttpErrorResponse | null = null;
  oPrelogin: IPrelogin | null = null;

  // Declaración de la variable 'siteKey' que almacenará la clave del sitio proporcionada por Google reCAPTCHA.
  // La clave del sitio es necesaria para configurar y asociar el reCAPTCHA con el sitio web.
  siteKey: string;

  constructor(
    private fb: FormBuilder,
    private oSessionService: SessionAjaxService,
    private oMatSnackBar: MatSnackBar,
    private oRouter: Router,
    private oCryptoService: CryptoService,
    private oTranslocoService: TranslocoService
  ) {
    // Asignación de la clave proporcionada por Google a la variable 'siteKey'.
    this.siteKey = '6LfAIy8pAAAAALy82ZqPGMAze-k4cdOW1gC-aKxx'
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      captcha: ['', [Validators.required]]
    });
  }

  getPreloginData() {
    this.oSessionService.prelogin().subscribe({
      next: (data: IPrelogin) => {
        this.oPrelogin = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
        this.oMatSnackBar.open("Error in prelogin operation.", '', { duration: 2000 });
      }
    });
  }

  ngOnInit() {
    this.getPreloginData();
  }

  onSubmit() {
    if (this.captchaElem && this.captchaElem.getResponse()) {
    if (this.loginForm.valid && this.oPrelogin) {
      const captchaAnswer = this.loginForm.value.captcha;
      const username = this.loginForm.value.username;
      const hashedPassword = this.oCryptoService.getSHA256(this.loginForm.value.password);
      const token = this.oPrelogin.token;

      this.oSessionService.loginCaptcha(username, hashedPassword, token, captchaAnswer).subscribe({
        next: (data: string) => {
          this.oSessionService.setToken(data);
          this.oSessionService.emit({ type: 'login' });
          this.oMatSnackBar.open(this.oTranslocoService.translate('login.successfull'), '', { duration: 2000 });
          this.oRouter.navigate(['/home']);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open(this.oTranslocoService.translate('global.error') + this.oTranslocoService.translate('global.in') + this.oTranslocoService.translate('login.operation'), '', { duration: 2000 });
          this.getPreloginData();
          this.loginForm.reset();
        }
      });
    }
          // En caso de que el captcha no este marcado salta un aviso.
  } else {
    this.oMatSnackBar.open("Please complete the captcha.", '', { duration: 2000 });
  }
  }

  onReset() {
    this.loginForm.reset();
    this.getPreloginData();
  }

  onRegister() {
    this.oRouter.navigate(['/user/user/new']);
  }

  loginAdmin() {
    this.loginForm.setValue({
      username: 'pedropicapiedra',
      password: 'foxforum',
      captcha: ''
    })
  }

  loginUser() {
    this.loginForm.setValue({
      username: 'pablomarmol',
      password: 'foxforum',
      captcha: ''
    })
  }

}
