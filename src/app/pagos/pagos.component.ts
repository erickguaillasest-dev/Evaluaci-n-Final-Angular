import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PagoService } from './pago.service';
import { CondominoService } from '../condominos/condomino.service';
import { CondominoResponse } from '../condominos/condomino';
import { Pago } from './pago';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pagos.component.html'
})
export class PagosComponent implements OnInit {
  pagoForm!: FormGroup;
  pagos: Pago[] = [];
  condominos: CondominoResponse[] = [];
  pagoIdSeleccionado: number | null = null;

  constructor(
    private fb: FormBuilder,
    private pagoService: PagoService,
    private condominoService: CondominoService
  ) {}

  ngOnInit(): void {
    this.iniciarFormulario();
    this.cargarPagos();
    this.cargarCondominos();
  }

  iniciarFormulario(): void {
    this.pagoForm = this.fb.group({
      fechaPago: [new Date().toISOString().substring(0, 10), Validators.required],
      anioMesPago: ['', [Validators.required, Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])$/)]],
      valorPagoAlicuota: ['', [Validators.required, Validators.min(0.01)]],
      valorPagoConsumoServicios: ['', [Validators.required, Validators.min(0)]],
      cedulaCondomino: ['', Validators.required]
    });
  }

  cargarPagos(): void {
    this.pagoService.getPagos().subscribe({
      next: (data) => (this.pagos = data),
      error: (err) => console.error('Error al obtener pagos:', err)
    });
  }

  cargarCondominos(): void {
    this.condominoService.listarTodos().subscribe({
      next: (data) => (this.condominos = data),
      error: (err) => console.error('Error al cargar condóminos:', err)
    });
  }

  cargarParaEditar(pago: any): void {
    this.pagoIdSeleccionado = pago.id;
    const cedula = pago.condomino?.cedulaCondomino || pago.cedulaCondomino || '';

    this.pagoForm.patchValue({
      fechaPago: pago.fechaPago,
      anioMesPago: pago.anioMesPago,
      valorPagoAlicuota: pago.valorPagoAlicuota,
      valorPagoConsumoServicios: pago.valorPagoConsumoServicios,
      cedulaCondomino: cedula
    });
  }

  limpiarFormulario(): void {
    this.pagoIdSeleccionado = null;
    this.pagoForm.reset({
      fechaPago: new Date().toISOString().substring(0, 10),
      anioMesPago: '',
      valorPagoAlicuota: '',
      valorPagoConsumoServicios: '',
      cedulaCondomino: ''
    });
  }

  guardarPago(): void {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }

    const formValues = this.pagoForm.getRawValue();

    const pagoBody: any = {
      fechaPago: formValues.fechaPago,
      anioMesPago: formValues.anioMesPago,
      valorPagoAlicuota: formValues.valorPagoAlicuota,
      valorPagoConsumoServicios: formValues.valorPagoConsumoServicios,
      cedulaCondomino: formValues.cedulaCondomino,
      condomino: {
        cedulaCondomino: formValues.cedulaCondomino
      }
    };

    if (this.pagoIdSeleccionado) {
      this.pagoService.actualizarPago(this.pagoIdSeleccionado, pagoBody).subscribe({
        next: () => {
          alert('Pago actualizado correctamente');
          this.limpiarFormulario();
          this.cargarPagos();
        },
        error: (err) => alert(err.error?.message || 'Error al actualizar pago')
      });
    } else {
      this.pagoService.registrarPago(pagoBody).subscribe({
        next: () => {
          alert('Pago registrado correctamente');
          this.limpiarFormulario();
          this.cargarPagos();
        },
        error: (err) => alert(err.error?.message || 'Error al registrar pago')
      });
    }
  }

  eliminarPago(id: number): void {
    if (confirm('¿Está seguro de eliminar este pago?')) {
      this.pagoService.eliminarPago(id).subscribe({
        next: () => {
          alert('Pago eliminado correctamente');
          this.cargarPagos();
        },
        error: (err) => alert(err.error?.message || 'Error al eliminar pago')
      });
    }
  }
}