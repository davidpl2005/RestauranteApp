import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  form!: FormGroup;
  mostrarPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre:   ['', [Validators.required, Validators.minLength(3)]],
      correo:   ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  async register() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mostrarToast('Completa todos los campos correctamente', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Registrando usuario...',
      spinner: 'crescent'
    });
    await loading.present();

    const { nombre, correo, password } = this.form.value;

    this.authService.register(nombre, correo, password).subscribe({
      next: async () => {
        await loading.dismiss();
        this.mostrarToast('¡Registro exitoso! Ahora inicia sesión', 'success');
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        await loading.dismiss();
        const mensaje = err.error?.error || 'Error al registrar';
        this.mostrarToast(mensaje, 'danger');
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

  irALogin() {
    this.router.navigate(['/login']);
  }
}