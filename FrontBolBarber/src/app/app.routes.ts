import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { ProductsUserComponent } from './products-user/products-user.component';
import { CitationsUserComponent } from './citations-user/citations-user.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeUserComponent },
    { path: 'products', component: ProductsUserComponent },
    { path: 'citations', component: CitationsUserComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'about', component: AboutComponent }
];
