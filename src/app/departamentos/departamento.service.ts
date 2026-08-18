import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento } from './departamento';

@Injectable({ providedIn: 'root' })
export class DepartamentoService {
  private apiUrl = 'https://evaluaci-n-final-spring.onrender.com/api/departamentos';

  constructor(private http: HttpClient) {}

  getDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.apiUrl);
  }

  registrarDepartamento(dep: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(this.apiUrl, dep);
  }
}