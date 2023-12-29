import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from 'rxjs';
import { ChattingService } from 'src/app/services/chats/chatting.service';
import { UserregistrationService } from 'src/app/services/users/userregistration.service';

interface user{
  name:string;
  email:string;
  status:string;
  password:string;
  image:string;
  createdAt:string;
  updatedAt:string;
  _id:string
}

interface messages{
  senderId:string;
  reciever_id:string;
  message:string
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,AfterViewInit {

  users:user[]=[];
  selectedUser:user;
  messageArray =[];
  newMessage:string;
  id:string;
  @ViewChild('scroll',{static:false})scroll:ElementRef;
  constructor(private userservice:UserregistrationService,private route:ActivatedRoute,
    private chatservice:ChattingService,private matDialog:MatDialog) { }
  
  ngAfterViewInit(): void {
    // this.scrollToBottom();
    this.chatservice.getDeletedMessageId().subscribe((id)=>{
      const deletedId= id+"_container";
      console.log(deletedId);
      var messageContainer = document.getElementById(deletedId);
      console.log(messageContainer);
      messageContainer.innerHTML='This message was deleted';
    });
  }

  ngOnInit(): void {
    this.userservice.getUsers().subscribe((res:any)=>{
         this.users=res;
         this.route.params.subscribe((param)=>{
           const id=param['id'] ;//ja
           this.id=param['id'];
          this.users=this.users.filter((data)=>data._id!==id);
         });
        this.chatservice.getOnlineUsers().subscribe((data)=>{
          this.updateStatus(data);
        });
        this.chatservice.getMessages().subscribe((data)=>{
          console.log(data);
          this.messageArray.push(data);
          console.log(this.messageArray);
        });
  });

  }
  updateStatus(data: any) {
    const userId= data.user_id +'_status';
    var id=document.getElementById(userId);
    id.innerHTML='Online';
  }

  updateSelectedUser(selected:user){
      this.selectedUser=selected;
      this.load();
  }

  load(){
    this.chatservice.getSavedMessage(this.id,this.selectedUser?._id).subscribe((data)=>{
      console.log(data);
      this.messageArray=data;
      console.log(this.messageArray);
    });
  }


  sendMessage(event:Event){
    event.preventDefault();
    const messageData={
      senderId:this.id,
      reciever_id:this.selectedUser._id,
      message:this.newMessage,
      isdelete:false
    }
   this.chatservice.sendMessages(messageData).subscribe((res)=>{
     console.log(res);
     this.load();
   });
   this.newMessage='';
  }

  scrollToBottom(){
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }


  deleteText(id:string)
  {
    console.log(id);
    this.chatservice.deleteMessage(id);
    const deletedId= id+"_container";
    var messageContainer = document.getElementById(deletedId);
    console.log(deletedId);
    messageContainer.innerHTML='This message was deleted';
  }
}
