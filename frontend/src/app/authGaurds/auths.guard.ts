import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthserviceService } from './authservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthsGuard implements CanActivate {

  constructor(private route:Router,private authService:AuthserviceService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):any {
    let id=sessionStorage.getItem('id');//if we open new screen on using localstorage shows id of previous logged user instead if we use session once a new page is opened new session is created
    console.log(id);
    if(id)
    {
      console.log(id);
      return true;
    }
    else{
      this.authService.redirectUrl=state.url; //assigning url to a class so that when routing to home via a link the url is not lost
      this.route.navigateByUrl('/login');
    }
  }
  
}
