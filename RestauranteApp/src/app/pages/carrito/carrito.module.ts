import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { CarritoPage } from './carrito.page';

const routes: Routes = [{ path: '', component: CarritoPage }];

@NgModule({
  declarations: [CarritoPage],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)]
})
export class CarritoPageModule {}