import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UploadListComponent } from './components/upload-list/upload-list.component';
import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/gallery', pathMatch: 'full' },
  { path: 'gallery', component: PhotoGalleryComponent },
  { path: 'admin', component: UploadListComponent, canActivate: [authGuard] },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
