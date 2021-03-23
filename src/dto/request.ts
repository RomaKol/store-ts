import { Advertisement } from "./advertisement";
import { User } from "./user";

export interface Request {
  id: string
  advertisementId: string;
  uid: string;
}