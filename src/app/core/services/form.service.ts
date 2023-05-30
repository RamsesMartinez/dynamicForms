import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Registro} from "../models/registro.model";

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private registros: BehaviorSubject<Registro[]> = new BehaviorSubject<Registro[]>([]);

  constructor() {
  }

  getRegistros(): Observable<Registro[]> {
    return this.registros.asObservable();
  }

  agregarRegistro(registro: Registro): void {
    // Obtener los registros actuales
    const registrosActuales = this.registros.getValue();

    // Agregar el nuevo registro
    registrosActuales.push(registro);

    // Actualizar el BehaviorSubject con los registros actualizados
    this.registros.next(registrosActuales);
  }

  eliminarRegistro(index: number): void {
    // Obtener los registros actuales
    const registrosActuales = this.registros.getValue();

    // Eliminar el registro en el índice dado
    registrosActuales.splice(index, 1);

    // Actualizar el BehaviorSubject con los registros actualizados
    this.registros.next(registrosActuales);
  }
}
