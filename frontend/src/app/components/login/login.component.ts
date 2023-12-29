import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChattingService } from 'src/app/services/chats/chatting.service';
import { UserregistrationService } from 'src/app/services/users/userregistration.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginEnabled:boolean=true;
  loginForm:FormGroup;
  signupForm:FormGroup;
  display: boolean;
  formData : FormData = new FormData();
  file: any;

  constructor(private fb:FormBuilder,
    private userservice:UserregistrationService,
    private router:Router,
    private snackbar:MatSnackBar,private chatService:ChattingService) { }

  ngOnInit(): void {
    this.createForm();
  
  }

  createForm(){
    this.loginForm = this.fb.group({
      'email':new FormControl(null,[Validators.required,Validators.email]),
      'password':new FormControl(null,[Validators.required])
    });
    this.signupForm = this.fb.group({
      'name':new FormControl(null,[Validators.required,Validators.minLength(2),Validators.maxLength(50)]),
      'email':new FormControl(null,[Validators.required,Validators.email]),
      'password':new FormControl(null,[Validators.required])
    });
  }

  switchToSignUpOrLoginScreen(){
    let loginWrapperContent=document.getElementById('login-wrapper-content-id');
    loginWrapperContent.classList.toggle('card-flipped'); //add the CSS class if it does not exist in the classList array and return true . If the CSS class exists, the method will remove the class and return false
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

  submitForm(){
    if(this.signupForm.valid)
    {
      this.formData.append('name',this.signupForm.get('name').value);
      this.formData.append('email',this.signupForm.get('email').value);
      this.formData.append('password',this.signupForm.get('password').value);
      this.formData.append('image',this.file);
      this.userservice.registerUser(this.formData).subscribe((res)=>{
        console.log(res);
      })
    }
  }

  submitLoginForm()
  {
    console.log(this.loginForm.value);
    this.userservice.loginUser(this.loginForm.value).subscribe((res:any)=>{
      const data = res;
      this.chatService.setUserStatusOnline(data?._id).then((boolean)=>{
        console.log(boolean);
      });
      localStorage.setItem('id',data._id);
      this.router.navigate(['/home',data._id]);
      // const boolean = await this.userservice.setUserStatusOnline(res._id);
      //two ways of calling a promise type using async and await which using await returns resolve or reject value another type is traditional .then()
    },
    (err)=>{
        this.snackbar.open('Incorrect email or password . Login failed','Close');
    })
  
  }
}
