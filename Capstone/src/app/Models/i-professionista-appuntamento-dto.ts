import { IUtenteDto } from "./i-utente-dto";

export interface IProfessionistaAppuntamentoDto {
  id: number;
  dataPrenotazione: string;
  oraPrenotazione: string;
  descrizione?: string;  // Aggiungi questa riga
  confermato: boolean;
  utente: IUtenteDto;
}
