import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  modoEdicion: boolean = false;

  constructor(
    private fb: FormBuilder,
    private condominoService: CondominoService
  ) {}

  ngOnInit(): void {
    this.iniciarFormulario();
    this.cargarCondominos();
  }

  iniciarFormulario(): void {
    this.condominoForm = this.fb.group({
      cedulaCondomino: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombreCondomino: ['', Validators.required],
      apellidoCondomino: ['', Validators.required],
      celularCondomino: [''],
      telefonoCondomino: [''],
      numeroBloque: ['', [Validators.required, Validators.min(1)]],
      numeroDepartamento: ['', [Validators.required, Validators.min(1)]]
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

    const payload = this.condominoForm.getRawValue();

    if (this.modoEdicion) {
      const cedula = payload.cedulaCondomino;
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

  editar(condomino: CondominoResponse): void {
    this.modoEdicion = true;
    this.condominoForm.setValue({
      cedulaCondomino: condomino.cedulaCondomino,
      nombreCondomino: condomino.nombreCondomino,
      apellidoCondomino: condomino.apellidoCondomino,
      celularCondomino: condomino.celularCondomino || '',
      telefonoCondomino: condomino.telefonoCondomino || '',
      numeroBloque: condomino.numeroBloque,
      numeroDepartamento: condomino.numeroDepartamento
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