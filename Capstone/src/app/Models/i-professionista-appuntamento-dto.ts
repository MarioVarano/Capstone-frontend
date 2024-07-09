import { IUtenteDto } from "./i-utente-dto";

export interface IProfessionistaAppuntamentoDto {
  id: number;
  dataPrenotazione: string;
  oraPrenotazione: string;
  confermato: boolean;
  utente: IUtenteDto;
}
