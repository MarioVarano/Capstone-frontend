import { IUtenteDto } from "./i-utente-dto";

export interface IProfessionistaAppuntamentoDto {
  id: number;
  dataPrenotazione: string;
  oraPrenotazione: string;
  descrizione?: string;
  confermato: boolean;
  utente: IUtenteDto;
}
