import { Clinic } from "./clinic";
import { User } from "./user";

export interface Patient {
  id: string;
  createdBy: User;
  firstName: string;
  lastName: string;
  gender: string;
  birthdate: Date;
  email: string;
  phoneNumber: string;
  clinic: Clinic;
}
