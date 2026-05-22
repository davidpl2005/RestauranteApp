import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { EditarPerfilPage } from './editar-perfil.page';

const routes: Routes = [{ path: '', component: EditarPerfilPage }];

@NgModule({
  declarations: [EditarPerfilPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class EditarPerfilPageModule {}