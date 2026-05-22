import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { PedidoService } from '../../core/services/pedido.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: false
})
export class PedidosPage implements OnInit {

  pedidos: any[] = [];
  cargando: boolean = false;

  estadoConfig: any = {
    pendiente:  { color: 'warning',  icono: 'time-outline',          texto: 'Pendiente'  },
    preparando: { color: 'primary',  icono: 'flame-outline',         texto: 'Preparando' },
    listo:      { color: 'tertiary', icono: 'checkmark-done-outline', texto: 'Listo'      },
    entregado:  { color: 'success',  icono: 'bag-check-outline',     texto: 'Entregado'  },
    cancelado:  { color: 'danger',   icono: 'close-circle-outline',  texto: 'Cancelado'  }
  };

  constructor(
    private pedidoService: PedidoService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarPedidos();
  }

  ionViewWillEnter() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.cargando = true;
    this.pedidoService.getPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarToast('Error al cargar pedidos', 'danger');
      }
    });
  }

  verDetalle(id: number) {
    this.router.navigate(['/tabs/pedidos/detalle', id]);
  }

  getEstado(estado: string) {
    return this.estadoConfig[estado] || {
      color: 'medium',
      icono: 'help-outline',
      texto: estado
    };
  }

  doRefresh(event: any) {
    this.pedidoService.getPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        event.target.complete();
      },
      error: () => {
        event.target.complete();
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