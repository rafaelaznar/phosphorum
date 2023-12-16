import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IPrelogin } from 'src/app/model/model.interfaces';
import { CryptoService } from 'src/app/service/crypto.service';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.ts.service';

@Component({
  selector: 'app-login-routed',
  templateUrl: './login-routed.component.html',
  styleUrls: ['./login-routed.component.css']
})

export class LoginRoutedComponent implements OnInit {

  loginForm: FormGroup;
  status: HttpErrorResponse | null = null;
  oPrelogin: IPrelogin | null = null;

  constructor(
    private fb: FormBuilder,
    private oSessionService: SessionAjaxService,
    private oMatSnackBar: MatSnackBar,
    private oRouter: Router,
    private oCryptoService: CryptoService
  ) {
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
    if (this.loginForm.valid && this.oPrelogin) {
      const captchaAnswer = this.loginForm.value.captcha;
      const username = this.loginForm.value.username;
      const hashedPassword = this.oCryptoService.getSHA256(this.loginForm.value.password);
      const token = this.oPrelogin.token;

      this.oSessionService.loginCaptcha(username, hashedPassword, token, captchaAnswer).subscribe({
        next: (data: string) => {
          this.oSessionService.setToken(data);
          this.oSessionService.emit({ type: 'login' });
          this.oMatSnackBar.open("Login successful.", '', { duration: 2000 });
          this.oRouter.navigate(['/home']);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open("Error in loggin operation.", '', { duration: 2000 });
          this.getPreloginData();
          this.loginForm.reset();
        }
      });
    }
  }

  onReset() {
    this.loginForm.reset();
    this.getPreloginData();
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
