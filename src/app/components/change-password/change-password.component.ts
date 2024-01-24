import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangePasswordDto } from 'src/app/model/model.changePasswordDto';
import { CryptoService } from 'src/app/service/crypto.service';
import { EmailPasswordService } from 'src/app/service/emailPassword.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  updatePasswordForm: FormGroup; 
  tokenPassword: string | null = ''; 

  constructor(
    private oMatSnackBar: MatSnackBar, 
    private oEmailPasswordService: EmailPasswordService,
    private oRouter: Router,
    private oCryptoService: CryptoService, 
    private oActivatedRoute: ActivatedRoute,
    private fb: FormBuilder, 
  ) { 
    this.updatePasswordForm = this.fb.group({ 
      password: ['', [Validators.required]], 
      confirmPassword: ['', [Validators.required]], 
    });
  }

  ngOnInit() {

  }

  onSubmit() {
    if (this.updatePasswordForm.get('password')?.value != this.updatePasswordForm.get('confirmPassword')?.value) {
      this.oMatSnackBar.open('Passwords do not match', 'OK', { duration: 3000 });
      return;
    }

    this.tokenPassword = this.oActivatedRoute.snapshot.paramMap.get('tokenPassword'); //Check
    
    const cryptedPassword = this.oCryptoService.getSHA256(this.updatePasswordForm.get('password')?.value);

    const oChangePasswordDto = new ChangePasswordDto(cryptedPassword, cryptedPassword, this.tokenPassword);
    
    this.oEmailPasswordService.changePassword(oChangePasswordDto).subscribe({
      next: (data: string) => {
        this.oMatSnackBar.open('Password Updated', 'OK', { duration: 2000 });
        this.oRouter.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.oMatSnackBar.open('Error updating password', 'OK', { duration: 2000 });
      }
    });
  }
}
