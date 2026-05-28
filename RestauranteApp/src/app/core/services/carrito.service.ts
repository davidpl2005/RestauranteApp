import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CapacitorHttp } from '@capacitor/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = environment.apiUrl;

  private totalItemsSubject = new BehaviorSubject<number>(0);
  totalItems$ = this.totalItemsSubject.asObservable();

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

  getCarrito(): Observable<any> {
    return from(
      this.getAuthHeaders().then(headers =>
        CapacitorHttp.get({
          url: `${this.apiUrl}?ruta=carrito`,
          headers
        })
      )
    ).pipe(
      map(response => response.data),
      tap(res => {
        const items = res?.items || [];
        const total = items.reduce((sum: number, item: any) => {
          return sum + Number(item.cantidad || 0);
        }, 0);

        this.totalItemsSubject.next(total);
      })
    );
  }

  agregar(id_producto: number, cantidad: number): Observable<any> {
    return from(
      this.getAuthHeaders().then(headers =>
        CapacitorHttp.post({
          url: `${this.apiUrl}?ruta=carrito`,
          headers,
          data: { id_producto, cantidad }
        })
      )
    ).pipe(
      map(response => response.data),
      tap(() => {
        this.getCarrito().subscribe();
      })
    );
  }

  actualizar(id_producto: number, cantidad: number): Observable<any> {
    return from(
      this.getAuthHeaders().then(headers =>
        CapacitorHttp.put({
          url: `${this.apiUrl}?ruta=carrito`,
          headers,
          data: { id_producto, cantidad }
        })
      )
    ).pipe(
      map(response => response.data),
      tap(() => {
        this.getCarrito().subscribe();
      })
    );
  }

  eliminar(id_producto: number): Observable<any> {
    return from(
      this.getAuthHeaders().then(headers =>
        CapacitorHttp.delete({
          url: `${this.apiUrl}?ruta=carrito&id_producto=${id_producto}`,
          headers
        })
      )
    ).pipe(
      map(response => response.data),
      tap(() => {
        this.getCarrito().subscribe();
      })
    );
  }

  vaciar(): Observable<any> {
    return from(
      this.getAuthHeaders().then(headers =>
        CapacitorHttp.delete({
          url: `${this.apiUrl}?ruta=carrito`,
          headers
        })
      )
    ).pipe(
      map(response => response.data),
      tap(() => {
        this.totalItemsSubject.next(0);
      })
    );
  }

  actualizarContador(total: number) {
    this.totalItemsSubject.next(total);
  }
}