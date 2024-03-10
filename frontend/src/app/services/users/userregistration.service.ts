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

  createGroup(data:any)
  {
    const postUrl = 'http://localhost:3000/groups/createGroup';
    return this.http.post(postUrl,data);
  }

  getUserAddedGroups(userId:string)
  {
    const postUrl = 'http://localhost:3000/groups/userAddedGroups';
    return this.http.post(postUrl,{userId:userId});
  }

  getGroups()
  {
    const getUrl = 'http://localhost:3000/groups/getGroup';
    return this.http.get(getUrl);
  }

  getImageUrl(image:string)
  {
    return this.http.get('http://localhost:3000/'+image);
  }

  isMemberPartOfGroup(id:string,userId:string)
  {
    const postUrl = 'http://localhost:3000/groups/invite-link';
     return this.http.post(postUrl,{userId:userId,groupId:id}); 
  }
}


