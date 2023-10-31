import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-thread-plist-routed',
  templateUrl: './admin-thread-plist-routed.component.html',
  styleUrls: ['./admin-thread-plist-routed.component.css']
})
export class AdminThreadPlistRoutedComponent implements OnInit {

  id_user: number;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id_user = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") ?? "0");
  }

  ngOnInit() {
  }

}

