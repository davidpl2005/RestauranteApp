import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private apiUrl = environment.apiUrl;

  private totalItemsSubject = new BehaviorSubject<number>(0);
  totalItems$ = this.totalItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCarrito(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?ruta=carrito`).pipe(
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
    return this.http.post<any>(`${this.apiUrl}?ruta=carrito`, {
      id_producto,
      cantidad
    }).pipe(
      tap(() => {
        this.getCarrito().subscribe();
      })
    );
  }

  actualizar(id_producto: number, cantidad: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}?ruta=carrito`, {
      id_producto,
      cantidad
    }).pipe(
      tap(() => {
        this.getCarrito().subscribe();
      })
    );
  }

  eliminar(id_producto: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?ruta=carrito&id_producto=${id_producto}`).pipe(
      tap(() => {
        this.getCarrito().subscribe();
      })
    );
  }

  vaciar(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?ruta=carrito`).pipe(
      tap(() => {
        this.totalItemsSubject.next(0);
      })
    );
  }

  actualizarContador(total: number) {
    this.totalItemsSubject.next(total);
  }
}