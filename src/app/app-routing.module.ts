import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainmenuComponent } from './components/mainmenu/mainmenu.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { ResetpasswordrequestComponent } from './components/resetpasswordrequest/resetpasswordrequest.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register',component: RegisterComponent},
  {path: 'main', component: MainmenuComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'resetpasswordrequest', component: ResetpasswordrequestComponent},
  {path: 'resetpassword/:link', component: ResetpasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
