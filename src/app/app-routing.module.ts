import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRoutedViewAdminComponent } from './components/user/routed/view/admin/admin-user-view-routed/user-routed-view-admin.component';
import { HomeRoutedComponent } from './components/shared/home-routed/home-routed.component';

const routes: Routes = [
  { path: '', component: HomeRoutedComponent },
  { path: 'home', component: HomeRoutedComponent },
  { path: 'admin/user/view/:id', component: UserRoutedViewAdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
