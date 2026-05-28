import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { CapacitorHttp } from '@capacitor/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = environment.apiUrl;

  getProductos(): Observable<any[]> {
    return from(
      CapacitorHttp.get({
        url: `${this.apiUrl}?ruta=productos`,
        headers: { 'Content-Type': 'application/json' }
      })
    ).pipe(map(response => response.data));
  }
}