import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CondominoService } from './condomino.service';
import { CondominoResponse } from './condomino';

@Component({
  selector: 'app-condominos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './condominos.component.html',
  styleUrls: ['./condominos.component.css']
})
export class CondominosComponent implements OnInit {
  condominoForm!: FormGroup;
  condominos: CondominoResponse[] = [];
  bloques: any[] = [];
  departamentos: any[] = [];
  modoEdicion: boolean = false;

  private apiUrlBloques = 'https://evaluaci-n-final-spring.onrender.com/api/bloques';
  private apiUrlDepartamentos = 'https://evaluaci-n-final-spring.onrender.com/api/departamentos';

  constructor(
    private fb: FormBuilder,
    private condominoService: CondominoService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.iniciarFormulario();
    this.cargarCondominos();
    this.cargarBloques();
    this.cargarDepartamentos();
  }

  iniciarFormulario(): void {
    this.condominoForm = this.fb.group({
      cedulaCondomino: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombreCondomino: ['', Validators.required],
      apellidoCondomino: ['', Validators.required],
      celularCondomino: [''],
      telefonoCondomino: [''],
      numeroBloque: ['', Validators.required],
      numeroDepartamento: ['', Validators.required]
    });
  }

  cargarBloques(): void {
    this.http.get<any[]>(this.apiUrlBloques).subscribe({
      next: (data) => (this.bloques = data),
      error: (err) => console.error('Error al cargar bloques:', err)
    });
  }

  cargarDepartamentos(): void {
    this.http.get<any[]>(this.apiUrlDepartamentos).subscribe({
      next: (data) => (this.departamentos = data),
      error: (err) => console.error('Error al cargar departamentos:', err)
    });
  }

  cargarCondominos(): void {
    this.condominoService.listarTodos().subscribe({
      next: (data) => (this.condominos = data),
      error: (err) => console.error('Error al listar condóminos:', err)
    });
  }

  guardarOActualizar(): void {
    if (this.condominoForm.invalid) {
      this.condominoForm.markAllAsTouched();
      return;
    }

    const formValues = this.condominoForm.getRawValue();

    const payload = {
      cedulaCondomino: formValues.cedulaCondomino,
      nombreCondomino: formValues.nombreCondomino,
      apellidoCondomino: formValues.apellidoCondomino,
      celularCondomino: formValues.celularCondomino,
      telefonoCondomino: formValues.telefonoCondomino,
      numeroBloque: formValues.numeroBloque,
      numeroDepartamento: formValues.numeroDepartamento
    };

    if (this.modoEdicion) {
      const cedula = formValues.cedulaCondomino;
      this.condominoService.actualizar(cedula, payload).subscribe({
        next: () => {
          alert('Condómino actualizado con éxito');
          this.cancelarEdicion();
          this.cargarCondominos();
        },
        error: (err) => alert(err.error?.message || 'Error al actualizar')
      });
    } else {
      this.condominoService.guardar(payload).subscribe({
        next: () => {
          alert('Condómino creado con éxito');
          this.condominoForm.reset();
          this.cargarCondominos();
        },
        error: (err) => alert(err.error?.message || 'Error al guardar')
      });
    }
  }

  editar(condomino: any): void {
    this.modoEdicion = true;
    const numBloque = condomino.numeroBloque || condomino.bloque?.numeroBloque || '';
    const numDep = condomino.numeroDepartamento || condomino.departamento?.numeroDepartamento || '';

    this.condominoForm.setValue({
      cedulaCondomino: condomino.cedulaCondomino || '',
      nombreCondomino: condomino.nombreCondomino || '',
      apellidoCondomino: condomino.apellidoCondominio || condomino.apellidoCondomino || '',
      celularCondomino: condomino.celularCondomino || '',
      telefonoCondomino: condomino.telefonoCondominio || condomino.telefonoCondomino || '',
      numeroBloque: numBloque,
      numeroDepartamento: numDep
    });
    this.condominoForm.get('cedulaCondomino')?.disable();
  }

  eliminar(cedula: string): void {
    if (confirm(`¿Está seguro de eliminar al condómino con cédula ${cedula}?`)) {
      this.condominoService.eliminar(cedula).subscribe({
        next: () => {
          alert('Condómino eliminado');
          this.cargarCondominos();
        },
        error: (err) => alert('Error al eliminar')
      });
    }
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.condominoForm.reset();
    this.condominoForm.get('cedulaCondomino')?.enable();
  }
}