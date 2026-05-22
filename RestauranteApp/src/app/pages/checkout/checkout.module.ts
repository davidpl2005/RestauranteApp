import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutPage } from './checkout.page';

const routes: Routes = [{ path: '', component: CheckoutPage }];

@NgModule({
  declarations: [CheckoutPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class CheckoutPageModule {}