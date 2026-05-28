import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { CapacitorHttp } from '@capacitor/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
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

  getPedidos(): Observable<any[]> {
    return from(
      this.getAuthHeaders().then(headers =>
        CapacitorHttp.get({
          url: `${this.apiUrl}?ruta=pedidos`,
          headers
        })
      )
    ).pipe(map(response => response.data));
  }

  getPedidoById(id: number): Observable<any> {
    return from(
      this.getAuthHeaders().then(headers =>
        CapacitorHttp.get({
          url: `${this.apiUrl}?ruta=pedidos&id=${id}`,
          headers
        })
      )
    ).pipe(map(response => response.data));
  }

  crearPedido(): Observable<any> {
    return from(
      this.getAuthHeaders().then(headers =>
        CapacitorHttp.post({
          url: `${this.apiUrl}?ruta=pedidos`,
          headers,
          data: {}
        })
      )
    ).pipe(map(response => response.data));
  }

  procesarPago(id_pedido: number, metodo_pago: string, monto: number): Observable<any> {
    return from(
      this.getAuthHeaders().then(headers =>
        CapacitorHttp.post({
          url: `${this.apiUrl}?ruta=pagos`,
          headers,
          data: {
            id_pedido,
            metodo_pago,
            monto
          }
        })
      )
    ).pipe(map(response => response.data));
  }
}