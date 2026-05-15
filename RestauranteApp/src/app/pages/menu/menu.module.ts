import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { MenuPage } from './menu.page';

const routes: Routes = [{ path: '', component: MenuPage }];

@NgModule({
  declarations: [MenuPage],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)]
})
export class MenuPageModule {}