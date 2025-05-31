import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public inputEmail : String = "";
  public inputPassword : String = "";
  public apiResponse : any;

  constructor(private http : HttpClient, private router: Router){}

  goToRegister(){
      this.router.navigate(['/register']);
  }

  public login(){

    var url = "http://localhost:6542/api/login";

    var headers = new HttpHeaders().set(
      'Content-Type', 'application/json'
    );

    var body = {
      'email' : this.inputEmail,
      'password': this.inputPassword
    }

    this.http.post(url, body, {headers}).subscribe({
      next: (resp: any) => {
        var token = resp.token;

        sessionStorage.setItem('token', token);
        this.router.navigate(['/home']);
      },
      error: err => {
        console.log(err);
      }
    })

  }

}
