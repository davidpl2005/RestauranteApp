import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { PedidosPage } from './pedidos.page';

const routes: Routes = [{ path: '', component: PedidosPage }];

@NgModule({
  declarations: [PedidosPage],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)]
})
export class PedidosPageModule {}