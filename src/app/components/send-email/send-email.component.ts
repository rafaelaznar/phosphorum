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
  ) { 
    this.sendEmailForm = this.fb.group({
      mailTo: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    const mailTo = this.sendEmailForm.get('mailTo')?.value;
    console.log('mailTo:', mailTo); // Agrega este log para verificar el valor de mailTo
    this.oEmailPasswordService.sendEmail(new EmailValuesDto(mailTo)).subscribe({
        next: (data: string) => {
            console.log('Response data:', data); // Agrega este log para verificar la respuesta
            this.oMatSnackBar.open('Email sent', 'OK', { duration: 2000 });
        },
        error: (error: HttpErrorResponse) => {
            console.error('Error:', error); // Agrega este log para verificar el error
            this.oMatSnackBar.open('Error sending email', 'OK', { duration: 2000 });
        }
    });
}

}
