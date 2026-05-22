import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { CambiarPasswordPage } from './cambiar-password.page';

const routes: Routes = [{ path: '', component: CambiarPasswordPage }];

@NgModule({
  declarations: [CambiarPasswordPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class CambiarPasswordPageModule {}