import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { HomeRoutedComponent } from './components/shared/home-routed/home-routed.component';
import { MenuUnroutedComponent } from './components/shared/menu-unrouted/menu-unrouted.component';
import { AdminUserDetailUnroutedComponent } from './components/user/admin-user-detail-unrouted/admin-user-detail-unrouted.component';
import { AdminUserViewRoutedComponent } from './components/user/admin-user-view-routed/admin-user-view-routed.component';
import { AdminThreadViewRoutedComponent } from './components/thread/admin-thread-view-routed/admin-thread-view-routed.component';
import { AdminThreadDetailUnroutedComponent } from './components/thread/admin-thread-detail-unrouted/admin-thread-detail-unrouted.component';
import { AdminReplyViewRoutedComponent } from './components/reply/admin-reply-view-routed/admin-reply-view-routed.component';
import { AdminReplyDetailUnroutedComponent } from './components/reply/admin-reply-detail-unrouted/admin-reply-detail-unrouted.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeRoutedComponent,
    MenuUnroutedComponent,
    AdminUserDetailUnroutedComponent,
    AdminUserViewRoutedComponent,
    AdminThreadViewRoutedComponent,
    AdminThreadDetailUnroutedComponent,
    AdminReplyViewRoutedComponent,
    AdminReplyDetailUnroutedComponent
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
