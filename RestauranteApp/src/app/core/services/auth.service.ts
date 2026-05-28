import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CapacitorHttp } from '@capacitor/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private storage: Storage) {
    this.storage.create();
  }

  private async getAuthHeaders(): Promise<any> {
    const token = await this.storage.get('token');

    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  login(correo: string, password: string): Observable<any> {
    return from(
      CapacitorHttp.post({
        url: `${this.apiUrl}?ruta=auth&action=login`,
        headers: { 'Content-Type': 'application/json' },
        data: { correo, password }
      })
    ).pipe(
      map(response => response.data),
      tap(async (res: any) => {
        if (res?.token) {
          await this.storage.set('token', res.token);
          await this.storage.set('usuario', res.usuario);
        }
      })
    );
  }

  register(nombre: string, correo: string, password: string): Observable<any> {
    return from(
      CapacitorHttp.post({
        url: `${this.apiUrl}?ruta=auth&action=register`,
        headers: { 'Content-Type': 'application/json' },
        data: { nombre, correo, password }
      })
    ).pipe(map(response => response.data));
  }

  actualizarPerfil(nombre: string, correo: string): Observable<any> {
    return from(
      this.getAuthHeaders().then(headers =>
        CapacitorHttp.post({
          url: `${this.apiUrl}?ruta=auth&action=actualizarPerfil`,
          headers,
          data: { nombre, correo }
        })
      )
    ).pipe(
      map(response => response.data),
      tap(async (res: any) => {
        if (!res?.error) {
          const usuario = await this.storage.get('usuario');
          await this.storage.set('usuario', {
            ...usuario,
            nombre,
            correo
          });
        }
      })
    );
  }

  cambiarPassword(password_actual: string, password_nueva: string): Observable<any> {
    return from(
      this.getAuthHeaders().then(headers =>
        CapacitorHttp.post({
          url: `${this.apiUrl}?ruta=auth&action=cambiarPassword`,
          headers,
          data: { password_actual, password_nueva }
        })
      )
    ).pipe(map(response => response.data));
  }

  async logout(): Promise<void> {
    await this.storage.remove('token');
    await this.storage.remove('usuario');
  }

  async getToken(): Promise<string | null> {
    return await this.storage.get('token');
  }

  async getUsuario(): Promise<any> {
    return await this.storage.get('usuario');
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.storage.get('token');
    return !!token;
  }
}