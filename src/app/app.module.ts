import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { UserRoutedViewAdminComponent } from './components/user/routed/view/admin/admin-user-view-routed/user-routed-view-admin.component';
import { UserUnroutedDetailAdminComponent } from './components/user/routed/view/admin/admin-user-detail-unrouted/user-unrouted-detail-admin.component';
import { HomeRoutedComponent } from './components/shared/home-routed/home-routed.component';
import { MenuUnroutedComponent } from './components/shared/menu-unrouted/menu-unrouted.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeRoutedComponent,
    UserRoutedViewAdminComponent,
    UserUnroutedDetailAdminComponent,
    MenuUnroutedComponent
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
