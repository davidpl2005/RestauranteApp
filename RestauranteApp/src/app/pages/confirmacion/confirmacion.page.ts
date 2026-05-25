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
  id_pedido: number  = 0;
  id_factura: number = 0;
  total: number      = 0;
  metodo: string     = '';
  animando           = false;

  metodoNombres: any = {
    efectivo:      'Efectivo',
    tarjeta:       'Tarjeta',
    transferencia: 'Transferencia'
  };

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      const s        = nav.extras.state;
      this.referencia = s['referencia'];
      this.id_pedido  = s['id_pedido'];
      this.id_factura = s['id_factura'];
      this.total      = s['total'];
      this.metodo     = s['metodo'];
    }
  }

  ngOnInit() {
    if (!this.referencia) {
      this.router.navigate(['/tabs/menu']);
      return;
    }
    setTimeout(() => { this.animando = true; }, 80);
  }

  irAlMenu() {
    this.router.navigate(['/tabs/menu'], { replaceUrl: true });
  }

  irAPedidos() {
    this.router.navigate(['/tabs/pedidos'], { replaceUrl: true });
  }
}