import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface IUser {
  id: number;
  name: string;
  surname: string;
  lastname: string;
  email: string;
  username: string;
  role: boolean;
  threads: number;
  replies: number
}

@Component({
  selector: 'app-user-routed-view-admin',
  templateUrl: './user-routed-view-admin.component.html',
  styleUrls: ['./user-routed-view-admin.component.css']
})

export class UserRoutedViewAdminComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }




}
