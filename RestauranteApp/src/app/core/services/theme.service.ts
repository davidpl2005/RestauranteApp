import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _oscuro = new BehaviorSubject<boolean>(false);
  oscuro$ = this._oscuro.asObservable();

  constructor(private storage: Storage) {
    this.storage.create();
  }

  async inicializar() {
    const guardado = await this.storage.get('modo_oscuro');

    let activar: boolean;
    if (guardado !== null && guardado !== undefined) {
      activar = guardado;
    } else {
      // Detectar preferencia del sistema
      activar = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this._oscuro.next(activar);
    this._aplicar(activar);
  }

  async toggleTema() {
    const nuevo = !this._oscuro.value;
    this._oscuro.next(nuevo);
    this._aplicar(nuevo);
    await this.storage.set('modo_oscuro', nuevo);
  }

  esModoOscuro(): boolean {
    return this._oscuro.value;
  }

  private _aplicar(oscuro: boolean) {
    document.body.classList.toggle('dark', oscuro);
  }
}