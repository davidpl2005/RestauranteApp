import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { CarritoService } from '../../core/services/carrito.service';
import { PedidoService } from '../../core/services/pedido.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: false
})
export class CheckoutPage implements OnInit {

  carrito: any = { items: [], subtotal: 0, iva: 0, total: 0 };
  metodoPago: string = '';
  cargando: boolean = false;

  metodos = [
    {
      valor: 'efectivo',
      nombre: 'Efectivo',
      descripcion: 'Paga en efectivo al recoger tu pedido',
      icono: 'cash-outline'
    },
    {
      valor: 'tarjeta',
      nombre: 'Tarjeta',
      descripcion: 'Débito o crédito',
      icono: 'card-outline'
    },
    {
      valor: 'transferencia',
      nombre: 'Transferencia',
      descripcion: 'Transferencia bancaria',
      icono: 'phone-portrait-outline'
    }
  ];

  constructor(
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.cargando = true;
    this.carritoService.getCarrito().subscribe({
      next: (data) => {
        this.carrito = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.mostrarToast('Error al cargar el carrito', 'danger');
      }
    });
  }

  seleccionarMetodo(metodo: string) {
    this.metodoPago = metodo;
  }

  async confirmarPago() {
    if (!this.metodoPago) {
      this.mostrarToast('Selecciona un método de pago', 'warning');
      return;
    }

    if (this.carrito.items.length === 0) {
      this.mostrarToast('El carrito está vacío', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Procesando tu pedido...',
      spinner: 'crescent'
    });
    await loading.present();

    // Paso 1: crear el pedido
    this.pedidoService.crearPedido().subscribe({
      next: (pedidoRes) => {
        // Paso 2: procesar el pago
        this.pedidoService.procesarPago(
          pedidoRes.id_pedido,
          this.metodoPago,
          pedidoRes.total
        ).subscribe({
          next: async (pagoRes) => {
            await loading.dismiss();
            // Navegar a confirmación con los datos
            this.router.navigate(['/confirmacion'], {
              state: {
                referencia: pagoRes.referencia,
                id_pedido: pedidoRes.id_pedido,
                id_factura: pagoRes.id_factura,
                total: pedidoRes.total,
                metodo: this.metodoPago
              }
            });
          },
          error: async (err) => {
            await loading.dismiss();
            const msg = err.error?.error || 'Error al procesar el pago';
            this.mostrarToast(msg, 'danger');
          }
        });
      },
      error: async (err) => {
        await loading.dismiss();
        const msg = err.error?.error || 'Error al crear el pedido';
        this.mostrarToast(msg, 'danger');
      }
    });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}