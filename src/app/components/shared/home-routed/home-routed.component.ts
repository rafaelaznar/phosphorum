import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

interface IIndividuo { nombre: string; edad: number; sexo: string };

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
  selector: 'app-home-routed',
  templateUrl: './home-routed.component.html',
  styleUrls: ['./home-routed.component.css']
})

export class HomeRoutedComponent implements OnInit {


  constructor(

  ) { }

  ngOnInit() {
  }


}





