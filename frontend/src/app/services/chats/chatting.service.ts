import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChattingService {
  private url='http://localhost:3000';
  private socket:Socket;
  constructor(private http:HttpClient) { 
    
  }

  setUserStatusOnline(id:string):Promise<boolean>{
    console.log(id);
    this.socket=io(this.url,{transports:['websocket','polling','flashsocket'],auth:{token:`${id}`}});
    
    return new Promise((resolve,reject)=>{
      resolve(this.socket.active);
    });
  }

  getOnlineUsers():Observable<any>
  {
    //when new user logins socket.broadcasts its id to all the client socket calling that event 'onlineusers' who ever is calling the event 'online users' will get new data
    return new Observable<any>((observer)=>{
      this.socket.on('onlineUsers',(data)=>{
        observer.next(data);
      });
    })
    
  }

  getMessages():Observable<any>{
     return new Observable<any>((observer)=>{
       this.socket.on('loadMessages',function(data){
         observer.next(data);
       })
     })
  }

  sendMessages(data:any){
    const postUrl = 'http://localhost:3000/messages/sendMessage';
    return new Observable<any>((observer)=>{
      this.http.post(postUrl,data).subscribe((res:any)=>{
         const newdata = {...data,_id:res._id};
         this.socket.emit('new message',newdata);
          observer.next(res);
          observer.complete();
      });
    })
  }

  getSavedMessage(senderId:string,reciever_id:string):Observable<any>{
    const data={
      senderId:senderId,
      reciever_id:reciever_id
    }

    this.socket.emit('existing message',data);
    return new Observable<any>((observer)=>{
      this.socket.on('loadChat',function(response){
        console.log('res'+response.loadMessages);
          observer.next(response.loadMessages);
      });
    })
  }

  deleteMessage(id:string)
  {
    const data = {id:id};
    this.socket.emit('message deleted',data);
  }

  getDeletedMessageId():Observable<any>
  {
    return new Observable<any>((observer)=>{
      this.socket.on('deleted message',function(data){
        console.log(data);
        observer.next(data);
      })
    })
  }

}
