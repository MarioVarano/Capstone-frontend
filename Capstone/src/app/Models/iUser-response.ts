import { IUser } from "./iUser";
import { IProfessionista } from "./iprofessionista";

export interface IUserResponse {

  token: string;
  user: IUser;
  professionista: IProfessionista;
  specializzazione: string;
}
