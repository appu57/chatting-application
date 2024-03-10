import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from 'rxjs';
import { buffer } from 'rxjs/operator/buffer';
import { AuthserviceService } from 'src/app/authGaurds/authservice.service';
import { ChattingService } from 'src/app/services/chats/chatting.service';
import { UserregistrationService } from 'src/app/services/users/userregistration.service';

export interface user {
  name: string;
  email: string;
  status: string;
  password: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  _id: string
}

interface messages {
  senderId: string;
  reciever_id: string;
  message: string
}

interface group {
  _id: string,
  adminId: string,
  name: string,
  limit: number,
  image: string,
  createdAt: string;
  updatedAt: string;

}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  users: user[] = [];
  groups: group[] = [];
  selectedUser: user;
  selectedGroup: group;
  messageArray = [];
  groupmessageArray = [];
  newMessage: string;
  id: string;
  currentUser: user;
  showUsers: boolean = true;
  combinedGroup = [];
  @ViewChild('scroll', { static: false }) scroll: ElementRef;
  groupId: any;
  groupTobeJoined: group;
  showInputField: boolean = false;
  originalvalue: string;
  inputElement: any;
  constructor(private userservice: UserregistrationService, private route: ActivatedRoute,
    private chatservice: ChattingService, private matDialog: MatDialog, private authService: AuthserviceService,
    private el:ElementRef,private renderer:Renderer2) { }

  ngAfterViewInit(): void {
    this.chatservice.getDeletedMessageId().subscribe((id) => {
      const deletedId = id + "_container";
      var messageContainer = document.getElementById(deletedId);
      messageContainer.innerHTML = 'This message was deleted';
    });
    this.chatservice.getEditedMessage().subscribe((data)=>{
      const id=data.newmessage._id+"_container";
      let container =document.getElementById(id);
      container.innerHTML=data.newmessage.message;
    })
  }

  ngOnInit(): void {
    this.userservice.getUsers().subscribe((res: any) => {
      this.users = res;
      this.route.params.subscribe((param) => {
        const id = param['id'];//ja
        this.id = param['id'];
        this.currentUser = this.users.find((user) => user._id == this.id);
        this.users = this.users.filter((data) => data._id !== this.id);
        this.groupId = param['group_id'];
      });
      this.chatservice.getOnlineUsers().subscribe((data) => {
        this.updateStatus(data);
      });
      this.chatservice.getMessages().subscribe((data) => {
        this.messageArray.push(data);
      });
      this.chatservice.getNewGroupMessage().subscribe((data) => {
        this.groupmessageArray.push(data);
      })
      this.userservice.getGroups().subscribe((res: any) => {
        // this.groups=res.groups; //groups where user is admin
        // res.joinedGroups.map((group)=> this.groups.push(group.groupId)); //groups where user is member
        this.groups = res;
        this.userservice.isMemberPartOfGroup(this.groupId, this.id).subscribe((res: any) => {
          if (res.alreadyJoined == false) {
            this.groupTobeJoined = this.groups.filter((group) => group._id == this.groupId)[0];
          }
        })
        this.userservice.getUserAddedGroups(this.id).subscribe(res=>{
          console.log(res);
        })

        this.combinedGroup = [...this.users, ...this.groups];
      });
    });
  }
  updateStatus(data: any) {
    const userId = data.user_id + '_status';
    var id = document.getElementById(userId);
    id.innerHTML = 'Online';
  }

  updateSelectedUser(selected: user) {
    this.selectedUser = selected;
    this.groupId = null;
    console.log(this.selectedUser);
    this.load();
  }

  updateSelectedGroup(selected: group) {
    this.selectedGroup = selected;
    this.selectedUser = null;
    this.groupId = null;
    this.loadGroupMessage();
  }

  load() {
    this.chatservice.getSavedMessage(this.id, this.selectedUser?._id).subscribe((data) => {
      this.messageArray = data;
    });
  }


  sendMessage(event: Event) {
    event.preventDefault();
    const messageData = {
      senderId: this.id,
      reciever_id: this.selectedUser._id,
      message: this.newMessage,
      isdelete: false
    }
    this.chatservice.sendMessages(messageData).subscribe((res) => {
      this.load();
    });
    this.newMessage = '';
  }

  sendMessageToGroup(event: Event) {
    event.preventDefault();
    const messageData = {
      senderId: this.id,
      groupId: this.selectedGroup._id,
      message: this.newMessage,
      isdelete: false
    }
    this.chatservice.sendMessagesToGroup(messageData).subscribe((res) => {
      this.loadGroupMessage();
    });
    this.newMessage = '';
  }

  loadGroupMessage() {
    this.chatservice.getSavedGroupMessage(this.selectedGroup?._id).subscribe((data: any) => {
      this.groupmessageArray = data;
    });
  }
  scrollToBottom() {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }

  deleteText(id: string) {
    this.chatservice.deleteMessage(id);
    const deletedId = id + "_container";
    var messageContainer = document.getElementById(deletedId);
    messageContainer.innerHTML = 'This message was deleted';
  }

  deleteGroupText(id: string) {
    this.chatservice.deleteGroupMessage(id);
    const deletedId = id + "_container";
    var messageContainer = document.getElementById(deletedId);
    messageContainer.innerHTML = 'This message was deleted';
  }

  displayGroup() {
    this.showUsers = false;
  }

  createGroupLink(id: string) {
    var url = window.location.host + '/invite-link/' + id;

    var copiedInput = document.createElement('input');
    document.body.appendChild(copiedInput);
    copiedInput.value = url;
    copiedInput.select();
    document.execCommand("copy");
    copiedInput.setSelectionRange(0, 0);
  }

  // getImage(image:string)
  // {
  //   this.userservice.getImageUrl(image).subscribe((res)=>{
  //     console.log(res);
  //   })
  // }

  groupJoined() {
    this.selectedUser = this.users.filter((user) => user._id == this.id)[0];

  }



  applyStyles(output, input, value) { //restore the style that p tag into input tag before replacing p with input , 
    const styles = getComputedStyle(input);
    for (const prop of Array.from(styles)) {
      output.style.setProperty(prop, styles.getPropertyValue(prop));
    }
    output.value = value;
  }

  showInput(messageid: string, message: string) {
   const id=messageid+"_container";
   const messageContainer = document.getElementById(id);
   this.originalvalue=messageContainer.textContent;

   this.inputElement = document.createElement('input');//create global object for new value/old value or the new input tag to be accessible in any other function to replace because once replaced we need to use ngViewInit to access newly created inputElement using id if created locally
   this.inputElement.setAttribute('type','text');
   

   this.applyStyles(this.inputElement,messageContainer,this.originalvalue);//applies id and other styles

   const buffer='200';
   this.inputElement.style.width = `${this.inputElement.scrollWidth+ buffer}px`
   messageContainer.replaceWith(this.inputElement);

   this.inputElement.focus();
   this.showInputField=true;
  }

  deleteEditMessage(messageid: string,message:string) {
    this.showInputField=false;
    const span = document.createElement('span');
    span.id=messageid+"_container";
    this.applyStyles(span,this.inputElement,message);
    this.inputElement.replaceWith(span);
    span.textContent=message; 
    this.inputElement=null;
    this.originalvalue=null;
  }

  editMessage(id: string) {
    this.showInputField=false;
    const span = document.createElement('span');
    span.id=id+"_container";
    this.applyStyles(span,this.inputElement,this.inputElement.value);
    this.inputElement.replaceWith(span);
    span.textContent=this.inputElement.value; //since we globally declared any new changes in the inputElement will have value in inputElement.value
    this.chatservice.editUserMessage(this.inputElement.value,id);
    span.style.maxWidth='400px';
    span.style.overflowWrap='break-word';
    this.inputElement=null;
    this.originalvalue=null;
    span.style.width='auto';
  }

}
