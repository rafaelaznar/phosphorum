import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IReply, formOperation } from 'src/app/model/model.interfaces';
import { ReplyAjaxService } from 'src/app/service/reply.ajax.service.service';

@Component({
  selector: 'app-admin-reply-form-unrouted',
  templateUrl: './admin-reply-form-unrouted.component.html',
  styleUrls: ['./admin-reply-form-unrouted.component.css']
})

export class AdminReplyFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW'; // new or edit

  replyForm!: FormGroup;
  reply: IReply = {} as IReply;
  status: HttpErrorResponse | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private oReplyAjaxService: ReplyAjaxService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.initializeForm(this.reply);
  }

  initializeForm(reply: IReply) {
    this.replyForm = this.formBuilder.group({
      id: [reply.id],
      title: [reply.title, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      body: [reply.body, [Validators.required, Validators.maxLength(1000)]],
      user: [reply.user, [Validators.required]],
      thread: [reply.thread, [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oReplyAjaxService.getOne(this.id).subscribe({
        next: (data: IReply) => {
          this.reply = data;
          this.initializeForm(this.reply);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.matSnackBar.open("Error reading reply from server.", '', { duration: 1200 });
        }
      });
    } else {
      this.initializeForm(this.reply);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.replyForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.replyForm.valid) {
      if (this.operation == 'NEW') {
        this.oReplyAjaxService.newOne(this.replyForm.value).subscribe({
          next: (data: IReply) => {
            this.reply = data;
            this.initializeForm(this.reply);
            this.matSnackBar.open("Reply has been created.", '', { duration: 1200 });
            this.router.navigate(['/admin', 'reply', 'view', this.reply]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.matSnackBar.open("Can't create reply.", '', { duration: 1200 });
          }
        });
      } else {
        this.oReplyAjaxService.updateOne(this.replyForm.value).subscribe({
          next: (data: IReply) => {
            this.reply = data;
            this.initializeForm(this.reply);
            this.matSnackBar.open("Reply has been updated.", '', { duration: 1200 });
            this.router.navigate(['/admin', 'reply', 'view', this.reply.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.matSnackBar.open("Can't update reply.", '', { duration: 1200 });
          }
        });
      }
    }
  }
}
