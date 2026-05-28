import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { CapacitorHttp } from '@capacitor/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
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

  getFacturas(): Observable<any[]> {
    return from(
      this.getAuthHeaders().then(headers =>
        CapacitorHttp.get({
          url: `${this.apiUrl}?ruta=facturas`,
          headers
        })
      )
    ).pipe(map(response => response.data));
  }

  getFacturaById(id: number): Observable<any> {
    return from(
      this.getAuthHeaders().then(headers =>
        CapacitorHttp.get({
          url: `${this.apiUrl}?ruta=facturas&id=${id}`,
          headers
        })
      )
    ).pipe(map(response => response.data));
  }
}