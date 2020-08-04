import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  LoggedIN = '';
  unauthorized = '';

  constructor(
    private service: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if(params.unauthorized){
          this.unauthorized = params.unauthorized;
        }
      });
  }

  onSubmit(){
    const _email = this.loginForm.get('email').value;
    const _password = this.loginForm.get('password').value;
    this.service.login( _email, _password).subscribe((data:any)=>{
      this.LoggedIN = "Hurrah Log in ho gaya.";
      // console.log(data);
      this.router.navigate(['todolists']);
    })
  }

}
