import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CarritoService } from '../../core/services/carrito.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: false
})
export class CarritoPage implements OnInit {

  carrito: any = { items: [], subtotal: 0, iva: 0, total: 0 };
  cargando: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarCarrito();
  }

  ionViewWillEnter() {
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

  async cambiarCantidad(item: any, nuevaCantidad: number) {
    if (nuevaCantidad < 1) return;

    this.carritoService.actualizar(item.id_producto, nuevaCantidad).subscribe({
      next: () => {
        this.cargarCarrito();
      },
      error: (err) => {
        const msg = err.error?.error || 'Error al actualizar';
        this.mostrarToast(msg, 'danger');
      }
    });
  }

  async eliminarItem(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar producto',
      message: `¿Quieres eliminar ${item.nombre} del carrito?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.carritoService.eliminar(item.id_producto).subscribe({
              next: () => {
                this.mostrarToast('Producto eliminado', 'success');
                this.cargarCarrito();
              },
              error: () => {
                this.mostrarToast('Error al eliminar', 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async vaciarCarrito() {
    const alert = await this.alertCtrl.create({
      header: 'Vaciar carrito',
      message: '¿Estás seguro de vaciar todo el carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Vaciar',
          role: 'destructive',
          handler: () => {
            this.carritoService.vaciar().subscribe({
              next: () => {
                this.mostrarToast('Carrito vaciado', 'success');
                this.cargarCarrito();
              },
              error: () => {
                this.mostrarToast('Error al vaciar', 'danger');
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  irACheckout() {
    if (this.carrito.items.length === 0) {
      this.mostrarToast('El carrito está vacío', 'warning');
      return;
    }
    this.router.navigate(['/tabs/carrito/checkout']);
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  doRefresh(event: any) {
    this.carritoService.getCarrito().subscribe({
      next: (data) => {
        this.carrito = data;
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }
}