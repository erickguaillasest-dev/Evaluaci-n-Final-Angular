import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bloque } from './bloque';

@Injectable({ providedIn: 'root' })
export class BloqueService {
  private apiUrl = 'https://evaluaci-n-final-spring.onrender.com/api/bloques';

  constructor(private http: HttpClient) {}

  getBloques(): Observable<Bloque[]> {
    return this.http.get<Bloque[]>(this.apiUrl);
  }

  registrarBloque(bloque: Bloque): Observable<Bloque> {
    return this.http.post<Bloque>(this.apiUrl, bloque);
  }
}