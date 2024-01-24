import { Router } from '@angular/router';
import { EmailPasswordService } from './../../service/emailPassword.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailValuesDto } from 'src/app/model/model.emailValuesDto';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {
  sendEmailForm: FormGroup;
  
  constructor(
    private oMatSnackBar: MatSnackBar,
    private oEmailPasswordService: EmailPasswordService,
    private fb: FormBuilder,
    private oRouter: Router,
  ) { 
    this.sendEmailForm = this.fb.group({
      mailTo: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    const mailTo = this.sendEmailForm.get('mailTo')?.value;
    this.oEmailPasswordService.sendEmail(new EmailValuesDto(mailTo)).subscribe({
        next: (data: string) => {
            this.oMatSnackBar.open('Email sent', 'OK', { duration: 2000 });
            this.oRouter.navigate(['/home']);
        },
        error: (error: HttpErrorResponse) => {
            this.oMatSnackBar.open('Error sending email', 'OK', { duration: 2000 });
        }
    });
}

}
