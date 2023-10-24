import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { IUser, formOperation } from 'src/app/model/model.interfaces';

@Component({
  selector: 'app-admin-user-form-unrouted',
  templateUrl: './admin-user-form-unrouted.component.html',
  styleUrls: ['./admin-user-form-unrouted.component.css']
})
export class AdminUserFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; //new or edit

  userForm!: FormGroup;
  oUser: IUser = {} as IUser;
  status: HttpErrorResponse | null = null;

  constructor(private fb: FormBuilder, private oHttpClient: HttpClient) {
    this.userForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      lastname: [''],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      role: ['']
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oHttpClient.get<IUser>("http://localhost:8083/user/" + this.id).subscribe({
        next: (data: IUser) => {
          this.oUser = data;
          this.userForm = this.fb.group({
            id: [this.oUser.id],
            name: [this.oUser.name, Validators.required],
            surname: [this.oUser.surname, Validators.required],
            lastname: [this.oUser.lastname],
            email: [this.oUser.email, [Validators.required, Validators.email]],
            username: [this.oUser.username, Validators.required],
            role: [this.oUser.role]
          });
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        }
      })

    } else {
      this.userForm = this.fb.group({
        id: [''],
        name: ['', Validators.required],
        surname: ['', Validators.required],
        lastname: [''],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        role: ['']
      });
    }

  }

  onSubmit() {
    //if (this.userForm.valid) {
    // Aquí puedes enviar los datos del usuario al servidor o realizar otras acciones necesarias.
    //  console.log(this.userForm.value);
    //}
  }

}
