import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-user',
  imports: [],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.css'
})
export class HomeUserComponent {

    

    constructor(private router: Router) {}

    ngOnInit(){
      var session = sessionStorage.getItem('token');
      
      if(session == null || session.trim() == ''){
        this.router.navigate(['/login']);
      }
    }

    logOut(){
      sessionStorage.removeItem("token");
      this.router.navigate(['/login']);
    }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  goToCitations() {
      this.router.navigate(['/citations']);
    }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToAbout() {
    this.router.navigate(['/about']);
  }
}
