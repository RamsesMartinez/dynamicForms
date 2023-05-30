export interface CampoExtra {
  correo: string;
  telefono: string;
}

export interface Registro {
  nombre: string;
  fechaNacimiento: Date;
  camposExtras: CampoExtra[];
}
