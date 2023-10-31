import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-reply-plist-routed',
  templateUrl: './admin-reply-plist-routed.component.html',
  styleUrls: ['./admin-reply-plist-routed.component.css']
})
export class AdminReplyPlistRoutedComponent implements OnInit {

  id_user: number;
  id_thread: number;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id_user = parseInt(this.oActivatedRoute.snapshot.paramMap.get("iduser") ?? "0");
    this.id_thread = parseInt(this.oActivatedRoute.snapshot.paramMap.get("idthread") ?? "0");
  }

  ngOnInit() {
  }

}
