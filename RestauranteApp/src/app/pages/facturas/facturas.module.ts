import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { FacturasPage } from './facturas.page';

const routes: Routes = [{ path: '', component: FacturasPage }];

@NgModule({
  declarations: [FacturasPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class FacturasPageModule {}