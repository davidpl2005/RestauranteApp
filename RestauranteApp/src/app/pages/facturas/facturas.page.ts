import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FacturaService } from '../../core/services/factura.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
  standalone: false
})
export class FacturasPage implements OnInit {

  facturas: any[] = [];
  cargando: boolean = false;

  metodoNombres: any = {
    efectivo:      '💵 Efectivo',
    tarjeta:       '💳 Tarjeta',
    transferencia: '🏦 Transferencia'
  };

  constructor(
    private facturaService: FacturaService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarFacturas();
  }

  cargarFacturas() {
    this.cargando = true;
    this.facturaService.getFacturas().subscribe({
      next: (data) => {
        this.facturas = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarToast('Error al cargar facturas', 'danger');
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/tabs/perfil/facturas/detalle', id]);
  }

  doRefresh(event: any) {
    this.facturaService.getFacturas().subscribe({
      next: (data) => {
        this.facturas = data;
        event.target.complete();
      },
      error: () => event.target.complete()
    });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}