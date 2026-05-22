import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { DetallePedidoPage } from './detalle-pedido.page';

const routes: Routes = [{ path: '', component: DetallePedidoPage }];

@NgModule({
  declarations: [DetallePedidoPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class DetallePedidoPageModule {}