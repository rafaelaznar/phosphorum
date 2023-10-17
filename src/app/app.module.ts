import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { UserRoutedViewAdminComponent } from './components/user/routed/view/admin/user-routed-view-admin/user-routed-view-admin.component';
import { UserUnroutedDetailAdminComponent } from './components/user/routed/view/admin/user-unrouted-detail-admin/user-unrouted-detail-admin.component';


@NgModule({
  declarations: [
    AppComponent,
    UserRoutedViewAdminComponent,
    UserUnroutedDetailAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
