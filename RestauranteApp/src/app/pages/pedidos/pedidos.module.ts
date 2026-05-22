import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { PedidosPage } from './pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosPage
  },
  {
    path: 'detalle/:id',
    loadChildren: () =>
      import('../detalle-pedido/detalle-pedido.module').then(m => m.DetallePedidoPageModule)
  }
];

@NgModule({
  declarations: [PedidosPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class PedidosPageModule {}