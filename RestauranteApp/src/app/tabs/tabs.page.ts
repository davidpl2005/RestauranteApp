import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../core/services/carrito.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false
})
export class TabsPage implements OnInit {

  totalItemsCarrito: number = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.totalItems$.subscribe(total => {
      this.totalItemsCarrito = total;
    });

    this.carritoService.getCarrito().subscribe();
  }
}