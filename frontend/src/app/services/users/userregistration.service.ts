import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { Observable } from 'rxjs';
import { io,Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class UserregistrationService {
  private url='http://localhost:3000';
  private socket:Socket;
  constructor(private http:HttpClient) { 
    
  }


  registerUser(signupForm:any)
  {
    const posturl='http://localhost:3000/user/register';
    return this.http.post(posturl,signupForm);
  }

  loginUser(loginForm:any)
  {
    const loginUrl='http://localhost:3000/user/login';
    return this.http.post(loginUrl,loginForm);
  }


  getUsers(){
    return this.http.get('http://localhost:3000/user/getUsers');
  }
}
