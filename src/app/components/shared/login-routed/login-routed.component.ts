import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.ts.service';

@Component({
  selector: 'app-login-routed',
  templateUrl: './login-routed.component.html',
  styleUrls: ['./login-routed.component.css']
})

export class LoginRoutedComponent implements OnInit {

  loginForm: FormGroup;
  status: HttpErrorResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private oSessionService: SessionAjaxService,
    private oMatSnackBar: MatSnackBar,
    private oRouter: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.oSessionService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: (data: any) => {
          this.oSessionService.setToken(data);
          this.oMatSnackBar.open("Loggin successfull.", '', { duration: 2000 });
          this.oRouter.navigate(['/home']);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open("Error in loggin operation.", '', { duration: 2000 });
        }
      });
    }
  }

  onReset() {
    this.loginForm.reset();
  }

  loginAdmin() {
    this.loginForm.setValue({
      username: 'pedropicapiedra',
      password: 'e2cac5c5f7e52ab03441bb70e89726ddbd1f6e5b683dde05fb65e0720290179e'
    })
  }

  loginUser() {
    this.loginForm.setValue({
      username: 'pablomarmol',
      password: 'e2cac5c5f7e52ab03441bb70e89726ddbd1f6e5b683dde05fb65e0720290179e'
    })
  }

}
