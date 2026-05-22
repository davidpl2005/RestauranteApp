import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { ProductoService } from '../../core/services/producto.service';
import { CarritoService } from '../../core/services/carrito.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false
})
export class MenuPage implements OnInit {

  productos: any[]          = [];
  productosFiltrados: any[] = [];
  categorias: string[]      = [];
  categoriaSeleccionada     = 'Todas';
  cargando                  = false;
  cantidades: { [id: number]: number } = {};

  // Buscador
  terminoBusqueda = '';
  buscando        = false;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  ionViewWillEnter() {
    this.cargarProductos();
  }

  async cargarProductos() {
    this.cargando = true;
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.extraerCategorias();
        this.aplicarFiltros();
        this.cargando = false;
        data.forEach(p => {
          if (!this.cantidades[p.id_producto]) {
            this.cantidades[p.id_producto] = 1;
          }
        });
      },
      error: () => {
        this.cargando = false;
        this.mostrarToast('Error al cargar el menú', 'danger');
      }
    });
  }

  extraerCategorias() {
    const cats = this.productos
      .map(p => p.categoria || 'Sin categoría')
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort();
    this.categorias = ['Todas', ...cats];
  }

  // Aplica tanto categoría como búsqueda
  aplicarFiltros() {
    let resultado = this.productos;

    // Filtro por categoría
    if (this.categoriaSeleccionada !== 'Todas') {
      resultado = resultado.filter(
        p => (p.categoria || 'Sin categoría') === this.categoriaSeleccionada
      );
    }

    // Filtro por búsqueda
    if (this.terminoBusqueda.trim() !== '') {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(termino)) ||
        (p.categoria && p.categoria.toLowerCase().includes(termino))
      );
    }

    this.productosFiltrados = resultado;
  }

  filtrarPorCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.aplicarFiltros();
  }

  onBusqueda(event: any) {
    this.terminoBusqueda = event.detail.value || '';
    this.aplicarFiltros();
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.buscando        = false;
    this.aplicarFiltros();
  }

  toggleBuscador() {
    this.buscando = !this.buscando;
    if (!this.buscando) {
      this.limpiarBusqueda();
    }
  }

  incrementar(producto: any) {
    if (this.cantidades[producto.id_producto] < producto.stock) {
      this.cantidades[producto.id_producto]++;
    }
  }

  decrementar(producto: any) {
    if (this.cantidades[producto.id_producto] > 1) {
      this.cantidades[producto.id_producto]--;
    }
  }

  async agregarAlCarrito(producto: any) {
    if (producto.stock <= 0 || !producto.disponible) {
      this.mostrarToast('Producto no disponible', 'warning');
      return;
    }

    const cantidad = this.cantidades[producto.id_producto] || 1;

    const loading = await this.loadingCtrl.create({
      message: 'Agregando...',
      duration: 1500,
      spinner: 'crescent'
    });
    await loading.present();

    this.carritoService.agregar(producto.id_producto, cantidad).subscribe({
      next: async () => {
        await loading.dismiss();
        this.mostrarToast('✓ Agregado al carrito', 'success');
        this.cantidades[producto.id_producto] = 1;
        this.carritoService.getCarrito().subscribe();
      },
      error: async (err) => {
        await loading.dismiss();
        const msg = err.error?.error || 'Error al agregar';
        this.mostrarToast(msg, 'danger');
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

  doRefresh(event: any) {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.extraerCategorias();
        this.aplicarFiltros();
        data.forEach(p => {
          if (!this.cantidades[p.id_producto]) {
            this.cantidades[p.id_producto] = 1;
          }
        });
        event.target.complete();
      },
      error: () => event.target.complete()
    });
  }
}