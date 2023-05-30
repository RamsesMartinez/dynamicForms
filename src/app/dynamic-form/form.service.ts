import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {Registro} from "../core/models/registro.model";


@Injectable({
  providedIn: 'root'
})
export class FormService {
  private registros: BehaviorSubject<Registro[]> = new BehaviorSubject<Registro[]>([]);

  constructor() { }

  getRegistros(): Observable<Registro[]> {
    return this.registros.asObservable();
  }

  agregarRegistro(registro: Registro): void {
    const registrosActuales = this.registros.getValue();
    registrosActuales.push(registro);
    this.registros.next(registrosActuales);
  }

  eliminarRegistro(index: number): void {
    const registrosActuales = this.registros.getValue();
    registrosActuales.splice(index, 1);
    this.registros.next(registrosActuales);
  }
}
