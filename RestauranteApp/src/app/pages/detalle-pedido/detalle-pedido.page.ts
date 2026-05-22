import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PedidoService } from '../../core/services/pedido.service';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss'],
  standalone: false
})
export class DetallePedidoPage implements OnInit {

  pedido: any = null;
  detalles: any[] = [];
  cargando: boolean = false;
  subtotal: number = 0;
  iva: number = 0;

  estadoConfig: any = {
    pendiente:  { color: 'warning',  icono: 'time-outline',           texto: 'Pendiente'  },
    preparando: { color: 'primary',  icono: 'flame-outline',          texto: 'Preparando' },
    listo:      { color: 'tertiary', icono: 'checkmark-done-outline', texto: 'Listo'      },
    entregado:  { color: 'success',  icono: 'bag-check-outline',      texto: 'Entregado'  },
    cancelado:  { color: 'danger',   icono: 'close-circle-outline',   texto: 'Cancelado'  }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.cargarDetalle(id);
    }
  }

  cargarDetalle(id: number) {
    this.cargando = true;
    this.pedidoService.getPedidoById(id).subscribe({
      next: (data) => {
        this.pedido  = data.pedido;
        this.detalles = data.detalles;
        this.subtotal = this.pedido.total / 1.19;
        this.iva      = this.pedido.total - this.subtotal;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarToast('Error al cargar el pedido', 'danger');
        this.router.navigate(['/tabs/pedidos']);
      }
    });
  }

  getEstado(estado: string) {
    return this.estadoConfig[estado] || {
      color: 'medium',
      icono: 'help-outline',
      texto: estado
    };
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