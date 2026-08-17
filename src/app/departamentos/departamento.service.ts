import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento } from './departamento';

@Injectable({ providedIn: 'root' })
export class DepartamentoService {
  private apiUrl = 'http://localhost:8080/api/departamentos';

  constructor(private http: HttpClient) {}

  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.apiUrl);
  }

  registrarDepartamento(dep: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(this.apiUrl, dep);
  }
}