import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { addYears, differenceInYears } from 'date-fns';

interface Registro {
  nombre: string;
  fechaNacimiento: Date;
  email: string;
  telefono: string;
}

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  form!: FormGroup;
  camposAdicionales: number[] = [];
  registros: Registro[] = [];
  enviado = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  addCampoAdicional() {
    const index = this.camposAdicionales.length;
    this.camposAdicionales.push(index);
    this.form.addControl(`email_${index}`, this.fb.control('', [Validators.required, Validators.email]));
    this.form.addControl(`telefono_${index}`, this.fb.control('', Validators.required));
  }

  removeCampoAdicional(index: number) {
    this.camposAdicionales.splice(index, 1);
    this.form.removeControl(`email_${index}`);
    this.form.removeControl(`telefono_${index}`);
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const registro: Registro = {
      nombre: this.form.value.nombre,
      fechaNacimiento: this.form.value.fechaNacimiento,
      email: this.form.value.email_0,
      telefono: this.form.value.telefono_0
    };

    const registroExistente = this.registros.find(r =>
      r.nombre === registro.nombre &&
      r.fechaNacimiento === registro.fechaNacimiento &&
      r.email === registro.email
    );

    if (registroExistente) {
      alert('Ya existe un registro con los mismos datos');
      return;
    }

    for (let i = 1; i < this.camposAdicionales.length + 1; i++) {
      const email = this.form.value[`email_${i}`];
      const telefono = this.form.value[`telefono_${i}`];

      const registroExistente = this.registros.find(r =>
        r.nombre === registro.nombre &&
        r.fechaNacimiento === registro.fechaNacimiento &&
        r.email === email
      );

      if (registroExistente) {
        alert('Ya existe un registro con los mismos datos');
        return;
      }

      const nuevoRegistro: Registro = {
        nombre: registro.nombre,
        fechaNacimiento: registro.fechaNacimiento,
        email,
        telefono
      };

      this.registros.push(nuevoRegistro);
    }

    this.enviado = true;
  }

  calcularEdad(fechaNacimiento: Date): number {
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    const age = differenceInYears(today, birthDate);
    return age;
  }

}
