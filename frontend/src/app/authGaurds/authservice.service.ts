import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
 
  public redirectUrl :string | null =null;
  public id:string | null = null ;
  constructor() { }

  isAuthenticated(){
    return this.redirectUrl;
  }
}
