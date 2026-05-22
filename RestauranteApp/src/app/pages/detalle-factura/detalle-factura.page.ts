import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FacturaService } from '../../core/services/factura.service';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.page.html',
  styleUrls: ['./detalle-factura.page.scss'],
  standalone: false
})
export class DetalleFacturaPage implements OnInit {

  factura: any = null;
  detalles: any[] = [];
  cargando: boolean = false;

  metodoNombres: any = {
    efectivo:      'Efectivo',
    tarjeta:       'Tarjeta',
    transferencia: 'Transferencia'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facturaService: FacturaService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.cargarFactura(id);
    }
  }

  cargarFactura(id: number) {
    this.cargando = true;
    this.facturaService.getFacturaById(id).subscribe({
      next: (data) => {
        this.factura  = data.factura;
        this.detalles = data.detalles;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarToast('Error al cargar la factura', 'danger');
        this.router.navigate(['/tabs/perfil/facturas']);
      }
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