import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'menu',
        loadChildren: () =>
          import('../pages/menu/menu.module').then(m => m.MenuPageModule)
      },
      {
        path: 'carrito',
        loadChildren: () =>
          import('../pages/carrito/carrito.module').then(m => m.CarritoPageModule)
      },
      {
        path: 'pedidos',
        loadChildren: () =>
          import('../pages/pedidos/pedidos.module').then(m => m.PedidosPageModule)
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('../pages/perfil/perfil.module').then(m => m.PerfilPageModule)
      },
      {
        path: '',
        redirectTo: 'menu',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  declarations: [TabsPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class TabsPageModule {}