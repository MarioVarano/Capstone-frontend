import { IUser } from "./iUser";

export interface IProfessionista extends IUser{
  specializzazione: string;
  descrizione: string;
}
