import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BloquesComponent } from './bloques/bloques.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { CondominosComponent } from './condominos/condominos.component';
import { PagosComponent } from './pagos/pagos.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bloques', component: BloquesComponent },
  { path: 'departamentos', component: DepartamentosComponent },
  { path: 'condominos', component: CondominosComponent },
  { path: 'pagos', component: PagosComponent },
  { path: '**', redirectTo: '' }
];