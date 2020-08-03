import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { Observable, throwError, fromEvent } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Message } from '../models/message.model';
import { AuthenticationService } from '../authentication.service'
import { User } from '../models/user.model';

export function forbiddenPasswordValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenPassword': {value: control.value}} : null;
  };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  
  registerForm = new FormGroup({
    fullname: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
      ]),
    email: new FormControl(''),
    password: new FormControl('', [
      forbiddenPasswordValidator(/^[a-zA-Z0-9!@#%]+/i)
    ]),
    confirmpassword: new FormControl('')
  })
  emailMsg: string;
  CreationMessage : string;

  constructor(
    private service: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.CreationMessage = '';
    this.emailMsg = '';
  }

  ngAfterViewInit() {
    // let controlBlurs: Observable<any>[] = fromEvent(this.registerForm.get('email'), 'blur');
    // return controlBlurs;
  }

  onBlur(email_val:string){
    this.service.checkemail(email_val).subscribe((message_obj:Message)=>{
      this.emailMsg = message_obj.message;
      },(Error:any)=>{
        this.emailMsg = Error.error.message;
      })
  }

  onSubmit(){
    const user = {
      fullname : this.registerForm.get('fullname').value,
      email: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value
    };

    this.service.register(user).subscribe((message_obj:Message)=>{
        this.CreationMessage = message_obj.message;
      },(Error:any)=>{
        this.CreationMessage = Error.error.message;
      })
  }

  get fullname(){
    return this.registerForm.get('fullname');
  }

  get password(){
    return this.registerForm.get('password');
  }

}
