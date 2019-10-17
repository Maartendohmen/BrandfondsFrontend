import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainmenuComponent } from './components/mainmenu/mainmenu.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'main', component: MainmenuComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
