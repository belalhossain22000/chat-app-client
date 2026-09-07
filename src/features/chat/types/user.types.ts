import type { ISODateString } from "@/types/common.types";

export interface User {
  id: string;
  name: string;
  phone: string;
}

export interface CurrentUser extends User {
  createdAt: ISODateString;
}
