export interface IAppuntamento {
  id?: number;
  idProfessionista?: number;
  idUtente?: number;
  dataPrenotazione: string;
  oraPrenotazione: string;
  confermato: boolean;
}
