import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CondominoRequest, CondominoResponse } from './condomino';

@Injectable({
  providedIn: 'root'
})
export class CondominoService {
  private apiUrl = 'http://localhost:8080/api/condominios';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<CondominoResponse[]> {
    return this.http.get<CondominoResponse[]>(this.apiUrl);
  }

  obtenerPorCedula(cedula: string): Observable<CondominoResponse> {
    return this.http.get<CondominoResponse>(`${this.apiUrl}/${cedula}`);
  }

  guardar(condomino: CondominoRequest): Observable<CondominoResponse> {
    return this.http.post<CondominoResponse>(this.apiUrl, condomino);
  }

  actualizar(cedula: string, condomino: CondominoRequest): Observable<CondominoResponse> {
    return this.http.put<CondominoResponse>(`${this.apiUrl}/${cedula}`, condomino);
  }

  eliminar(cedula: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cedula}`);
  }
}