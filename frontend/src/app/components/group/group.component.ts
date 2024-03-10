import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { UserregistrationService } from 'src/app/services/users/userregistration.service';
import { user } from '../home/home.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  display: boolean;
  formData : FormData = new FormData();
  file: any;
  @Input() users:user[]=[];
  @Input() id:string;
  selectedUser=[];
  groupForm:FormGroup;

  @Output() closeGroupTab:EventEmitter<void>=new EventEmitter();
  @ViewChild('userList',{static:false}) userList : MatSelectionList;
  constructor(private fb:FormBuilder,private userservice:UserregistrationService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.groupForm= this.fb.group({
      'name':new FormControl(null,[Validators.required]),
      'members':new FormControl([],[Validators.required,Validators.minLength(1)])
    })
  }

  closeGroup(){
   this.closeGroupTab.emit();
  }

  showImage(event:any)
  {
      var showImage = document.getElementById('show-image');
      var render = new FileReader();
      render.readAsDataURL(event.target.files[0]);
      render.onload = (_event) => { 
        showImage.style.backgroundImage=`url(${render.result})`;
        showImage.style.backgroundSize='cover';
        showImage.style.height='120px';
        showImage.style.width='120px';
        this.display=true;
    }  
     this.file = event.target.files[0];

  }

  deleteImage(){
    var showImage = document.getElementById('show-image');
    showImage.style.backgroundImage='';
    this.display=false;
  }

  onformSubmit(){
    const selectedUserIds = [];
    var selected=this.userList.selectedOptions.selected;
    selected.forEach((user)=>selectedUserIds.push(user.value._id));
    
    this.groupForm.get('members').value
    this.formData.append('groupImage',this.file);
    this.formData.append('adminId',this.id);
    this.formData.append('members',JSON.stringify(selectedUserIds));
    this.formData.append('name',this.groupForm.get('name').value);
    console.log(JSON.stringify(selectedUserIds));
    this.userservice.createGroup(this.formData).subscribe((res)=>{
      console.log(res);
    });
    this.closeGroupTab.emit();
    
  }

  removeSelected(id:string)
  {
    var selected=this.userList.selectedOptions.selected;
    var matListOption = selected.find((user)=>user.value._id==id); //within selectedOptions contains list with which value contains user details return matlistoption
    matListOption.selected=false;
  }
}
