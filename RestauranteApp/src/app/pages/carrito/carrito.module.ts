import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { CarritoPage } from './carrito.page';

const routes: Routes = [{ path: '', component: CarritoPage }];

@NgModule({
  declarations: [CarritoPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class CarritoPageModule {}