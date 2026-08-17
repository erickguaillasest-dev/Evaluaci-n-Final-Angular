import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-departamentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './departamentos.component.html'
})
export class DepartamentosComponent implements OnInit {
  depaForm!: FormGroup;
  departamentos: any[] = [];
  private apiUrl = 'http://localhost:8080/api/departamentos';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.depaForm = this.fb.group({
      numeroDepartamento: ['', Validators.required],
      descripcionDepartamento: ['', Validators.required]
    });
    this.cargarDepartamentos();
  }

  cargarDepartamentos(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => this.departamentos = data,
      error: (err) => console.error('Error al obtener departamentos:', err)
    });
  }

  guardarDepartamento(): void {
    if (this.depaForm.invalid) {
      this.depaForm.markAllAsTouched();
      return;
    }
    this.http.post(this.apiUrl, this.depaForm.value).subscribe({
      next: () => {
        alert('Departamento registrado con éxito');
        this.depaForm.reset();
        this.cargarDepartamentos();
      },
      error: (err) => console.error('Error al registrar departamento:', err)
    });
  }
}