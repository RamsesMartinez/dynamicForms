import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {differenceInYears, isAfter} from 'date-fns';
import {FormService} from '../core/services/form.service';
import {Registro} from "../core/models/registro.model";

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  form!: FormGroup;
  camposExtras!: FormArray;
  submitted = false;
  registros: Registro[] = [];

  constructor(
    private fb: FormBuilder,
    private formService: FormService
  ) {
  }

  get camposExtrasControls() {
    return this.camposExtras.controls;
  }

  ngOnInit() {
    // Inicialización del formulario
    this.form = this.fb.group({
      nombre: ['', [Validators.required, this.noDuplicado('nombre')]], // Validador personalizado para evitar duplicados en el campo 'nombre'
      fechaNacimiento: ['', [Validators.required, this.fechaMenorAHoy()]], // Validador personalizado para validar la fecha de nacimiento
      camposExtras: this.fb.array([], Validators.required) // Validador para asegurarse de que haya al menos un campo extra
    });

    this.camposExtras = this.form.get('camposExtras') as FormArray;

    // Obtener registros
    this.formService.getRegistros().subscribe(registros => {
      this.registros = registros;
    });
  }

  addCampoExtra() {
    // Agregar un campo extra
    const campoExtra = this.fb.group({
      correo: ['', [Validators.required, Validators.email, this.noDuplicadoCampoExtra('correo')]], // Validador personalizado para evitar duplicados en el campo 'correo'
      telefono: ['', [Validators.required, Validators.pattern('[0-9]{10}')]] // Validador para asegurar que el teléfono tenga un formato numérico de 10 dígitos
    });

    this.camposExtras.push(campoExtra);
  }

  removeCampoExtra(index: number) {
    // Eliminar un campo extra
    this.camposExtras.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Enviar el formulario
    const registro: Registro = {
      nombre: this.form.value.nombre,
      fechaNacimiento: this.form.value.fechaNacimiento,
      camposExtras: this.form.value.camposExtras
    };

    this.formService.agregarRegistro(registro);
    this.submitted = true;

    // Reiniciar el formulario y los campos extras
    this.form.reset();
    this.camposExtras.clear();
  }

  calcularEdad(fechaNacimiento: Date): number {
    // Calcular la edad a partir de la fecha de nacimiento
    const today = new Date();
    return differenceInYears(today, fechaNacimiento);
  }

  noDuplicado(campo: string) {
    return (control: FormControl) => {
      const value = control.value ? control.value.toLowerCase() : null;

      if (!value) {
        return null;
      }

      // Validar que no haya duplicados
      const duplicado = this.registros.some((registro: any) =>
        registro[campo]?.toLowerCase() === value
      );
      return duplicado ? {duplicado: true} : null;
    };
  }

  noDuplicadoCampoExtra(campo: string) {
    return (control: FormControl) => {
      const value = control.value ? control.value.toLowerCase() : null;

      if (!value) {
        return null;
      }

      // Validar que no haya duplicados dentro de los campos extras
      const campoExtraIndex = this.camposExtras.controls.findIndex((campoExtra: AbstractControl) =>
        (campoExtra as FormGroup).get(campo)?.value?.toLowerCase() === value
      );

      const duplicado = campoExtraIndex !== -1 && campoExtraIndex !== this.camposExtras.controls.indexOf(control.parent as AbstractControl);

      return duplicado ? {duplicado: true} : null;
    };
  }

  fechaMenorAHoy() {
    return (control: FormControl) => {
      // Validar que la fecha de nacimiento sea menor a la fecha actual
      const fechaNacimiento = control.value;
      const hoy = new Date();
      return isAfter(fechaNacimiento, hoy) ? {fechaInvalida: true} : null;
    };
  }
}
