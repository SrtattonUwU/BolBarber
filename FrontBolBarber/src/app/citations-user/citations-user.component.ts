import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaderResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-citations-user',
  imports: [FormsModule, CommonModule],
  templateUrl: './citations-user.component.html',
  styleUrl: './citations-user.component.css'
})
export class CitationsUserComponent {
  citations: any[] = [];

  showAddCitation = false;
  showModifyCitation = false;
  showDeleteCitation = false;

  editPopupVisible = false;
  confirmDeletePopupVisible = false;

  newCitation = {
    selectedDate: '',
    selectedHour: '',
    selectedBarber: ''
  }

  editCitation = {
    selectedDate: '',
    selectedHour: '',
    selectedBarber: ''
  }

  barbers: { _id: string; name: string }[] = [];

  selectedCitationIndex: number | null = null;
  citationToDeleteIndex: number | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadBarbers();
    this.loadUserCitations();
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToAbout() {
    this.router.navigate(['/about']);
  }

  logOut(){
    sessionStorage.removeItem("token");
    this.router.navigate(['/login']);
  }

  loadBarbers() {
    this.http.get<{ barbers: { _id: string; name: string }[] }>('http://localhost:6542/api/barbers')
      .subscribe({
        next: (res) => {
          this.barbers = res.barbers;
        },
        error: (err) => {
          console.error('Error cargando barberos:', err);
        }
      });
  }

  getBarberName(barberId: string): string{
    const barber = this.barbers.find(b => b._id === barberId);
    return barber ? barber.name : 'Desconocido';
  }

  showAddCitationForm(){
    this.showAddCitation = true;
    this.showModifyCitation = false;
    this.editPopupVisible = false;
    this.showDeleteCitation = false;
    this.confirmDeletePopupVisible = false;
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

  confirmCitation(){
    if(this.newCitation.selectedDate && this.newCitation.selectedBarber && this.newCitation.selectedHour){
      const fullDate = new Date(`${this.newCitation.selectedDate}T${this.newCitation.selectedHour}:00`);

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

      const body = {
        userId: userId,
        barberId: this.newCitation.selectedBarber,
        date: fullDate.toISOString(),
        status: true
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      });

      const url = 'http://localhost:6542/api/citation';
      
      this.http.post(url, body, {headers}).subscribe({
        next: (res: any) => {
          alert('Cita agregada');
          this.citations.push(res);
          this.newCitation = { selectedDate: '', selectedHour: '', selectedBarber: '' };
          this.showAddCitation = false;
        },
        error: err => {
          console.error(err);
          alert('Barbero ocupado (1 hr)');
        }
      });     
    }else{
      alert('Por favor completa todos los campos');
    }
  }

  modifyCitation(){
    if(this.citations.length > 0){
      this.showModifyCitation = true;
      this.showAddCitation = false;
      this.editPopupVisible = false;
      this.showDeleteCitation = false;
      this.confirmDeletePopupVisible = false;
    } else {
      alert('No hay citas para modificar');
    }
  }

  deleteShowCitation(){
    if(this.citations.length > 0){
      this.showModifyCitation = false;
      this.showAddCitation = false;
      this.editPopupVisible = false;
      this.showDeleteCitation = true;
      this.confirmDeletePopupVisible = false;
    } else {
      alert('No hay citas para eliminar');
    }
  }

  openEditPopup(index: number){
    this.selectedCitationIndex = index;
    this.editCitation = {...this.citations[index] };
    this.editPopupVisible = true;
  }

  loadUserCitations(){
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('No se ha iniciado sesión');
      return;
    }
    const decoded = this.parseJwt(token);
    const userId = decoded ? decoded.sub || decoded.id || decoded._id : null;

    if (!userId) {
      alert('Token inválido');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    });

    const url = `http://localhost:6542/api/citation/user/${userId}`;

    this.http.get<{citations: any[]}>(url, {headers}).subscribe({
      next: (res) => {
        this.citations = res.citations;
      },
      error: (err) =>{
        console.error('Error al cargar citas del usuario:', err);
        alert('No se pudieron cargar tus citas');
      }
    });

  }

  saveEditedCitation(){
    if(this.selectedCitationIndex !== null){
      if (this.editCitation.selectedDate && this.editCitation.selectedHour && this.editCitation.selectedBarber) {
        const fullDate = new Date(`${this.editCitation.selectedDate}T${this.editCitation.selectedHour}:00`);

        const token = sessionStorage.getItem('token');
        if (!token) {
          alert('No se ha iniciado sesión');
          return;
        }

        const decoded = this.parseJwt(token);
        const userId = decoded ? decoded.sub || decoded.id || decoded._id : null;

        if (!userId) {
          alert('Token inválido');
          return;
        }

        const citationId = this.citations[this.selectedCitationIndex]._id;

        const body = {
          userId: userId,
          barberId: this.editCitation.selectedBarber,
          date: fullDate.toISOString()
        }

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        });

        const url = `http://localhost:6542/api/citation/update/${citationId}`;

        this.http.put(url, body, {headers}).subscribe({
          next: (res) => {
            alert('Cita modificada');
            this.loadUserCitations();
            this.citations[this.selectedCitationIndex!] = res;

            this.editPopupVisible = false;
            this.showModifyCitation = false;
            this.selectedCitationIndex = null;
            this.editCitation = { selectedDate: '', selectedHour: '', selectedBarber: '' };
          },
          error: (err) =>{
            console.error('Error modificando la cita:', err);
            alert('Error al modificar la cita');
          }
        });

      } else {
          alert('Por favor completa todos los campos para modificar la cita');
      }
    }
  }

  openDeletePopup(index: number){
    this.citationToDeleteIndex = index;
    this.confirmDeletePopupVisible = true;
  }

  deleteCitation(){
    if(this.citationToDeleteIndex !== null){
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

      const citationId = this.citations[this.citationToDeleteIndex]._id;

      const url = `http://localhost:6542/api/citation/delete/${citationId}`;

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      });

      this.http.delete(url, { headers }).subscribe({
        next: () => {
          alert('Cita eliminada correctamente');
          this.confirmDeletePopupVisible = false;
          this.citationToDeleteIndex = null;
          this.showDeleteCitation = false;
          this.loadUserCitations();
        },
        error: (err) => {
          console.error('Error al eliminar la cita:', err);
        }
      });
    }
  }

  confirmDeleteCitation(){
    if (this.citationToDeleteIndex !== null) {
      this.citations.splice(this.citationToDeleteIndex, 1);
      this.confirmDeletePopupVisible = false;
      this.citationToDeleteIndex = null;
      this.showDeleteCitation = false;
    }
  }

  cancelDeleteCitation(){
    this.confirmDeletePopupVisible = false;
    this.citationToDeleteIndex = null;
  }
  
  closepopup(){
    this.editPopupVisible = false;
  }
}
