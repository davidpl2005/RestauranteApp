import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.page.html',
  styleUrls: ['./confirmacion.page.scss'],
  standalone: false
})
export class ConfirmacionPage implements OnInit {

  referencia: string = '';
  id_pedido: number = 0;
  id_factura: number = 0;
  total: number = 0;
  metodo: string = '';

  metodoNombres: any = {
    efectivo: 'Efectivo',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia'
  };

  constructor(private router: Router) {
    // Recibir datos del estado de navegación
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      const state = nav.extras.state;
      this.referencia = state['referencia'];
      this.id_pedido  = state['id_pedido'];
      this.id_factura = state['id_factura'];
      this.total      = state['total'];
      this.metodo     = state['metodo'];
    }
  }

  ngOnInit() {
    // Si no hay datos redirigir al menú
    if (!this.referencia) {
      this.router.navigate(['/tabs/menu']);
    }
  }

  irAlMenu() {
    this.router.navigate(['/tabs/menu'], { replaceUrl: true });
  }

  irAPedidos() {
    this.router.navigate(['/tabs/pedidos'], { replaceUrl: true });
  }
}