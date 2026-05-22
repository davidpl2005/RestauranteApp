import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private modoOscuro = false;

  constructor(private storage: Storage) {
    this.storage.create();
  }

  async inicializar() {
    const guardado = await this.storage.get('modo_oscuro');
    this.modoOscuro = guardado ?? false;
    this.aplicarTema();
  }

  async toggleTema() {
    this.modoOscuro = !this.modoOscuro;
    await this.storage.set('modo_oscuro', this.modoOscuro);
    this.aplicarTema();
  }

  esModoOscuro(): boolean {
    return this.modoOscuro;
  }

  private aplicarTema() {
    document.body.classList.toggle('dark', this.modoOscuro);
  }
}