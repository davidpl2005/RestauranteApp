import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.storage.create();
  }

  login(correo: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}?ruta=auth&action=login`, {
      correo,
      password
    }).pipe(
      tap(async (res: any) => {
        await this.storage.set('token', res.token);
        await this.storage.set('usuario', res.usuario);
      })
    );
  }

  register(nombre: string, correo: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}?ruta=auth&action=register`, {
      nombre,
      correo,
      password
    });
  }

  actualizarPerfil(nombre: string, correo: string): Observable<any> {
    return this.http.put(`${this.apiUrl}?ruta=usuario`, {
      accion: 'perfil',
      nombre,
      correo
    }).pipe(
      tap(async (res: any) => {
        await this.storage.set('usuario', res.usuario);
      })
    );
  }

  cambiarPassword(password_actual: string, password_nueva: string): Observable<any> {
    return this.http.put(`${this.apiUrl}?ruta=usuario`, {
      accion: 'password',
      password_actual,
      password_nueva
    });
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