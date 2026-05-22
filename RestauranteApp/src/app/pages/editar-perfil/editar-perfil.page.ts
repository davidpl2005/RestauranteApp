import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: false
})
export class EditarPerfilPage implements OnInit {

  form!: FormGroup;
  usuario: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    this.usuario = await this.authService.getUsuario();

    this.form = this.fb.group({
      nombre: [
        this.usuario?.nombre || '',
        [Validators.required, Validators.minLength(3)]
      ],
      correo: [
        this.usuario?.correo || '',
        [Validators.required, Validators.email]
      ]
    });
  }

  // Detectar si hubo cambios
  hayCambios(): boolean {
    if (!this.usuario || !this.form) return false;
    return (
      this.form.value.nombre !== this.usuario.nombre ||
      this.form.value.correo !== this.usuario.correo
    );
  }

  async guardar() {
    if (this.form.invalid) {
      this.mostrarToast('Completa los campos correctamente', 'warning');
      return;
    }

    if (!this.hayCambios()) {
      this.mostrarToast('No hay cambios para guardar', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando cambios...',
      spinner: 'crescent'
    });
    await loading.present();

    const { nombre, correo } = this.form.value;

    this.authService.actualizarPerfil(nombre, correo).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.mostrarToast('✓ Perfil actualizado correctamente', 'success');
        // Volver al perfil con los datos actualizados
        this.router.navigate(['/tabs/perfil'], { replaceUrl: true });
      },
      error: async (err) => {
        await loading.dismiss();
        const msg = err.error?.error || 'Error al actualizar el perfil';
        this.mostrarToast(msg, 'danger');
      }
    });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}