import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

@Component({
  selector: 'app-admin-user-plist-routed',
  templateUrl: './admin-user-plist-routed.component.html',
  styleUrls: ['./admin-user-plist-routed.component.css']
})
export class AdminUserPlistRoutedComponent implements OnInit {

  bLoading: boolean = false;

  constructor(
    private oUserAjaxService: UserAjaxService,
    private oMatSnackBar: MatSnackBar
  ) { }

  ngOnInit() { }

  doGenerateRandomUsers(amount: number) {
    this.bLoading = true;
    console.log('doGenerateRandomUsers', amount);
    this.oUserAjaxService.generateRandomUsers(amount).subscribe({
      next: (oResponse) => {
        console.log('generateRandomUsers', oResponse);
        this.oMatSnackBar.open("Now there are " + oResponse + " users", '', { duration: 2000 });
        this.bLoading = false;
      },
      error: (oError) => {
        console.error('generateRandomUsers', oError);
        this.oMatSnackBar.open("Error generating users", '', { duration: 2000 });
        this.bLoading = false;
      },
    })
  }

}
