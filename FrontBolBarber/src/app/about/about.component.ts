import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-about',
  imports: [FormsModule, CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  contact = {
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  };

  constructor(private router: Router, private http: HttpClient) {}

  goToHome() {
    this.router.navigate(['/home']);
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

  logOut(){
      sessionStorage.removeItem("token");
      this.router.navigate(['/login']);
    }

  parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decodificando JWT', e);
      return null;
    }
  }

  sendContact() {
    const token = sessionStorage.getItem('token');

    if(!token){
      alert('No se ha iniciado sesión');
      return;
    }

    const decoded = this.parseJwt(token);
    const userId = decoded ? decoded.sub || decoded.id || decoded._id : null;

    if(!userId){
      alert('Token inválido');
    }

    const { firstName, lastName, email, message } = this.contact;

    if (!firstName || !lastName || !email || !message) {
      alert('Por favor completa todos los campos antes de enviar');
      return;
    }

    const body = {
      userId,
      firstName,
      lastName,
      email,
      text: message
    };

    const url = 'http://localhost:6542/api/privateCommentary';

    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      });

    this.http.post(url, body, { headers }).subscribe({
      next: () => {
        alert('Mensaje enviado correctamente. Gracias por contactarnos');
        this.contact = {
          firstName: '',
          lastName: '',
          email: '',
          message: ''
        };
      },
      error: (err) => {
        console.error('Error al enviar el mensaje:', err);
        alert('Error al enviar el mensaje');
      }
    });

  }
}
