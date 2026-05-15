import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { PerfilPage } from './perfil.page';

const routes: Routes = [{ path: '', component: PerfilPage }];

@NgModule({
  declarations: [PerfilPage],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)]
})
export class PerfilPageModule {}