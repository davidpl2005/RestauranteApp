import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { PerfilPage } from './perfil.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilPage
  },
  {
    path: 'editar',
    loadChildren: () =>
      import('../editar-perfil/editar-perfil.module').then(m => m.EditarPerfilPageModule)
  },
  {
    path: 'cambiar-password',
    loadChildren: () =>
      import('../cambiar-password/cambiar-password.module').then(m => m.CambiarPasswordPageModule)
  },
  {
    path: 'facturas',
    loadChildren: () =>
      import('../facturas/facturas.module').then(m => m.FacturasPageModule)
  },
  {
    path: 'facturas/detalle/:id',
    loadChildren: () =>
      import('../detalle-factura/detalle-factura.module').then(m => m.DetalleFacturaPageModule)
  }
];

@NgModule({
  declarations: [PerfilPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class PerfilPageModule {}