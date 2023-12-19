import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  updatePasswordForm: FormGroup;
  status: HttpErrorResponse | null = null;


  constructor(
    private oMatSnackBar: MatSnackBar,
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

  }


}
