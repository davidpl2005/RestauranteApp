import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?ruta=pedidos`);
  }

  getPedidoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?ruta=pedidos&id=${id}`);
  }

  crearPedido(): Observable<any> {
    return this.http.post(`${this.apiUrl}?ruta=pedidos`, {});
  }

  procesarPago(id_pedido: number, metodo_pago: string, monto: number): Observable<any> {
    return this.http.post(`${this.apiUrl}?ruta=pagos`, {
      id_pedido,
      metodo_pago,
      monto
    });
  }
}