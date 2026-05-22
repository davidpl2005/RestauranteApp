import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmacionPage } from './confirmacion.page';

const routes: Routes = [{ path: '', component: ConfirmacionPage }];

@NgModule({
  declarations: [ConfirmacionPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class ConfirmacionPageModule {}