export interface Condomino {
  cedulaCondomino: string;
  nombreCondomino: string;
  apellidoCondomino: string;
  celularCondomino?: string;
  telefonoCondomino?: string;
  numeroBloque: number;
  numeroDepartamento: number;
}

export type CondominoRequest = Condomino;
export type CondominoResponse = Condomino;