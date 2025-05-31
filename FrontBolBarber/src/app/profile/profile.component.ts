import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user = {
      name: '',
      email: ''
  };
  passwordData = {
    newPassword: '',
    confirmPassword: ''
  };

  isEditing = false;
  changePasswordVisible = false;

  constructor(private router: Router, private http: HttpClient) {}

  loadUserFromSession() {
    const storedUser = localStorage.getItem('usuarioActual');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  goToCitations() {
    this.router.navigate(['/citations']);
  }

  goToAbout() {
    this.router.navigate(['/about']);
  }

  editProfile() {
    this.isEditing = true;
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

  saveProfile() {
    if (!this.user.name || !this.user.email || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('Las contraseñas nuevas no coinciden');
      return;
    }

    const token = sessionStorage.getItem('token');
    if(!token){
      alert('No estás autenticado');
      return;
    }

    const decoded = this.parseJwt(token);
    const userId = decoded ? decoded.sub || decoded.id || decoded._id : null;

    if(!userId){
      alert('Token inválido');
      return;
    }

    const body = {
      name: this.user.name,
      email: this.user.email,
      password: this.passwordData.newPassword
    };

    const url = `http://localhost:6542/api/userEdit/${userId}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    });

    this.http.put(url, body, { headers }).subscribe({
      next: () => {
        alert('Datos actualizados');
        localStorage.setItem('usuarioActual', JSON.stringify(this.user));
        this.isEditing = false;

        this.user = {
          name: '',
          email: ''
        };
        this.passwordData = {
          newPassword: '',
          confirmPassword: ''
        };
      },
      error: (err) => {
        console.error('Error al actualizar datos:', err);
        alert('Error al actualizar datos');
      }
  });
  }

  cancelEdit() {
    this.isEditing = false;
    this.loadUserFromSession();
  }

  deleteAccount(){
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer');

    if (!confirmDelete) {
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado');
      return;
    }

    const decoded = this.parseJwt(token);
    const userId = decoded ? decoded.sub || decoded.id || decoded._id : null;

    if (!userId) {
      alert('Token inválido');
      return;
    }

    const url = `http://localhost:6542/api/user/delete/${userId}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    });

    this.http.delete(url, { headers }).subscribe({
      next: () => {
        alert('Cuenta eliminada correctamente');
        localStorage.removeItem('usuarioActual');
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al eliminar la cuenta:', err);
        alert('Error al eliminar la cuenta');
      }
    });
  }
}
