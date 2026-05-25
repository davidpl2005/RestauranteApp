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

  pedidos: any[]    = [];
  cargando: boolean = false;

  estadoConfig: any = {
    pendiente:  {
      bg: '#FEF3C7', color: '#92400E',
      icono: 'time-outline',           texto: 'Pendiente'
    },
    preparando: {
      bg: '#DBEAFE', color: '#1E40AF',
      icono: 'flame-outline',          texto: 'Preparando'
    },
    listo:      {
      bg: '#EDE9FE', color: '#5B21B6',
      icono: 'checkmark-done-outline', texto: 'Listo'
    },
    entregado:  {
      bg: '#D1FAE5', color: '#065F46',
      icono: 'bag-check-outline',      texto: 'Entregado'
    },
    cancelado:  {
      bg: '#FEE2E2', color: '#991B1B',
      icono: 'close-circle-outline',   texto: 'Cancelado'
    }
  };

  constructor(
    private pedidoService: PedidoService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() { this.cargarPedidos(); }

  ionViewWillEnter() { this.cargarPedidos(); }

  cargarPedidos() {
    this.cargando = true;
    this.pedidoService.getPedidos().subscribe({
      next: (data) => {
        this.pedidos  = data;
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
      bg: '#F1F5F9', color: '#475569',
      icono: 'help-outline', texto: estado
    };
  }

  doRefresh(event: any) {
    this.pedidoService.getPedidos().subscribe({
      next:  (data) => { this.pedidos = data; event.target.complete(); },
      error: ()     => event.target.complete()
    });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje, duration: 2000, color, position: 'bottom'
    });
    await toast.present();
  }
}