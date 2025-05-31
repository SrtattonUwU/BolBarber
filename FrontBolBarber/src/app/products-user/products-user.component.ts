import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-products-user',
  imports: [CommonModule],
  templateUrl: './products-user.component.html',
  styleUrl: './products-user.component.css'
})
export class ProductsUserComponent implements OnInit {
    products: any[] = [];
    cartItems: any[] = [];
    cartVisible = false;

    constructor(private http: HttpClient, private router: Router) {}

    ngOnInit(){
      var session = sessionStorage.getItem('token');
      
      if(session == null || session.trim() == ''){
        this.router.navigate(['/login']);
      }

      this.loadProducts();
    }


    goToHome() {
      this.router.navigate(['/home']);
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

    logOut(){
      sessionStorage.removeItem("token");
      this.router.navigate(['/login']);
    }

    addToCart(product: any) {
      const existingItem = this.cartItems.find(item => item._id === product._id);
      
      if(existingItem){
        existingItem.quantity += 1;
      } else {
        this.cartItems.push({...product, quantity : 1});
      }
    }

    toggleCart() {
      this.cartVisible = !this.cartVisible;
    }

    getTotal(): number {
      return this.cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
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

    pagar() {
      if (this.cartItems.length === 0) {
        alert('El carrito está vacío');
        return;
      }

      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('No estás autenticado');
        return;
      }

      const decodedToken = this.parseJwt(token);
      const userId = decodedToken ? decodedToken.sub || decodedToken.id || decodedToken._id : null;

      const url = 'http://localhost:6542/api/shoppingcart/add';

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      });

      const productsList = this.cartItems.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        productPrice: item.productPrice,
        productId: item._id
      }));

      const body = {
        userId: userId,
        productsList: productsList,
        status: true
      };

      this.http.post(url, body, { headers }).subscribe({
        next: (resp: any) => {
          alert('Gracias por su compra.');
          this.cartItems = [];
          this.cartVisible = false;
          this.loadProducts();
        },
        error: err => {
          console.error('Error al procesar pagos de productos:', err);
        }
      });

    }

    loadProducts() {
      const url = 'http://localhost:6542/api/product/find';
      
      const token = sessionStorage.getItem('token'); 

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      });

      this.http.get(url, { headers }).subscribe({
        next: (resp: any) => {
          this.products = resp.products;
        },
        error: err => {
          console.error('Error al cargar productos:', err);
        }
      });
    }

}
