import { Routes } from '@angular/router';
import { CatalogListComponent } from './catalog/catalog-list/catalog-list.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ConfirmComponent } from './auth/confirm/confirm.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { MiInformacionComponent } from './pages/mi-informacion/mi-informacion.component';
import { EditarPerfilComponent } from './pages/editar-perfil/editar-perfil.component';
import { RecuperarPasswordComponent } from './auth/recuperar-password/recuperar-password.component';
import { NuevaPasswordComponent } from './auth/nueva-password/nueva-password.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'confirmar/:token', component: ConfirmComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { path: 'nueva-password/:token', component: NuevaPasswordComponent },
  { path: 'catalogo', component: CatalogListComponent, canActivate: [authGuard] },
  { path: 'mi-informacion', component: MiInformacionComponent, canActivate: [authGuard] },
  { path: 'editar-perfil', component: EditarPerfilComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
];