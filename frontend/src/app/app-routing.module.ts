import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthsGuard } from './authGaurds/auths.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [

  {path:'home/:id',component:HomeComponent,canActivate:[AuthsGuard]},
  {path:'login',component:LoginComponent},
  {path: '' , redirectTo:'login',pathMatch:'full'},
  {path :'invite-link/:group_id',component:HomeComponent,canActivate:[AuthsGuard]}, //add authGaurd only if user is logged in they can join
  {path :'invite-link/:group_id/:id',component:HomeComponent,canActivate:[AuthsGuard]} //add authGaurd only if user is logged in they can join

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
