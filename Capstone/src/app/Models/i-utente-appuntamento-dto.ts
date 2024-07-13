import { IProfessionistaDto } from "./i-professionista-dto";

export interface IUtenteAppuntamentoDto {
  id: number;
  dataPrenotazione: string;
  oraPrenotazione: string;
  confermato: boolean;
  descrizione?: string;  // Aggiungi questa riga
  professionista: IProfessionistaDto;
}
