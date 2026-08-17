import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bloques',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bloques.component.html'
})
export class BloquesComponent implements OnInit {
  bloqueForm!: FormGroup;
  bloques: any[] = [];
  private apiUrl = 'http://localhost:8080/api/bloques';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.bloqueForm = this.fb.group({
      numeroBloque: ['', Validators.required],
      descripcionBloque: ['', Validators.required],
      ubicacion: ['', Validators.required]
    });
    this.cargarBloques();
  }

  cargarBloques(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => this.bloques = data,
      error: (err) => console.error('Error al obtener bloques:', err)
    });
  }

  guardarBloque(): void {
    if (this.bloqueForm.invalid) {
      this.bloqueForm.markAllAsTouched();
      return;
    }
    this.http.post(this.apiUrl, this.bloqueForm.value).subscribe({
      next: () => {
        alert('Bloque registrado con éxito');
        this.bloqueForm.reset();
        this.cargarBloques();
      },
      error: (err) => console.error('Error al registrar bloque:', err)
    });
  }
}