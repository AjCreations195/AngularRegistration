import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  genders = ['male', 'female']
  authForm!: FormGroup;
  error= '';
  url="";
  fileToUpload!:File;
  imageChangedEvent: any = '';
    croppedImage: any = '';

  constructor(private authService: AuthService,
    private router:Router) { }

  ngOnInit(): void {
    this.authForm = new FormGroup({
      'username': new FormControl(null),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'category': new FormControl('employee'),
      'gender': new FormControl('male'),
      'place': new FormControl(null),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'file':new FormControl(null)

    })
  }
  onSubmit() {
    if (!this.authForm.valid) {
      return
    } else {

      console.log(this.authForm);
      const email = this.authForm.controls['email'].value
      const password = this.authForm.controls['password'].value;

      let authObs:Observable<AuthResponseData>;

      if(this.isLoginMode){
        authObs =  this.authService.login(email,password);
      }else{
        authObs =  this.authService.signup(email, password);
    }        
    authObs.subscribe({
      next: resData => {
        console.log(resData);
        this.router.navigate(['/home'])
      }, error: errorMessage => {
      this.error =errorMessage
      }
    })
  }
  
  }


  onSelectFile(e: any){
    this.imageChangedEvent = e;
    this.fileToUpload = e.target.files[0]
    // if(e.target.files){
    //   var reader = new FileReader();
    //   reader.readAsDataURL(e.target.files[0]);
    //   reader.onload = (event:any)=>{
    //     this.url = event.target.result;
    //   }
    // }
  }
 
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
}
imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}
