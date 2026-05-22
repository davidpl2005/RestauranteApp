import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { FotoService } from '../../core/services/foto.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {

  usuario: any   = null;
  fotoPerfil: string | null = null;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private fotoService: FotoService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.usuario    = await this.authService.getUsuario();
    this.fotoPerfil = await this.fotoService.getFoto();
  }

  async ionViewWillEnter() {
    this.usuario    = await this.authService.getUsuario();
    this.fotoPerfil = await this.fotoService.getFoto();
  }

  async cambiarFoto() {
    const foto = await this.fotoService.tomarFoto();
    if (foto) {
      this.fotoPerfil = foto;
      this.mostrarToast('✓ Foto actualizada', 'success');
    }
  }

  esModoOscuro(): boolean {
    return this.themeService.esModoOscuro();
  }

  toggleTema() {
    this.themeService.toggleTema();
  }

  irAEditarPerfil() {
    this.router.navigate(['/tabs/perfil/editar']);
  }

  irACambiarPassword() {
    this.router.navigate(['/tabs/perfil/cambiar-password']);
  }

  irAFacturas() {
    this.router.navigate(['/tabs/perfil/facturas']);
  }

  async confirmarLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cerrar Sesión',
          role: 'destructive',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  getIniciales(): string {
    if (!this.usuario?.nombre) return '?';
    const partes = this.usuario.nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return partes[0][0].toUpperCase();
  }

  getRolTexto(): string {
    const roles: any = {
      cliente: 'Cliente',
      admin:   'Administrador',
      chef:    'Chef'
    };
    return roles[this.usuario?.rol] || 'Usuario';
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