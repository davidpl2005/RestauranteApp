import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

// Validador personalizado: nueva password diferente a la actual
function passwordDiferente(control: AbstractControl): ValidationErrors | null {
  const actual = control.get('password_actual')?.value;
  const nueva  = control.get('password_nueva')?.value;
  if (actual && nueva && actual === nueva) {
    return { iguales: true };
  }
  return null;
}

// Validador: confirmar password coincide
function passwordsCoinciden(control: AbstractControl): ValidationErrors | null {
  const nueva    = control.get('password_nueva')?.value;
  const confirmar = control.get('confirmar')?.value;
  if (nueva && confirmar && nueva !== confirmar) {
    return { noCoinciden: true };
  }
  return null;
}

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.page.html',
  styleUrls: ['./cambiar-password.page.scss'],
  standalone: false
})
export class CambiarPasswordPage implements OnInit {

  form!: FormGroup;
  mostrarActual  = false;
  mostrarNueva   = false;
  mostrarConfirmar = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      password_actual: ['', [Validators.required]],
      password_nueva:  ['', [Validators.required, Validators.minLength(3)]],
      confirmar:       ['', [Validators.required]]
    }, {
      validators: [passwordDiferente, passwordsCoinciden]
    });
  }

  async guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mostrarToast('Completa todos los campos correctamente', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Actualizando contraseña...',
      spinner: 'crescent'
    });
    await loading.present();

    const { password_actual, password_nueva } = this.form.value;

    this.authService.cambiarPassword(password_actual, password_nueva).subscribe({
      next: async () => {
        await loading.dismiss();
        this.mostrarToast('✓ Contraseña actualizada correctamente', 'success');
        this.router.navigate(['/tabs/perfil'], { replaceUrl: true });
      },
      error: async (err) => {
        await loading.dismiss();
        const msg = err.error?.error || 'Error al cambiar la contraseña';
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