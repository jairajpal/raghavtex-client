export interface CommonApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface AuthUserData {
  user: User;
  access_token: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface LoginReqData {
  password: string;
  phone_number: string;
  google_uid?: string;
}

export interface RegisterReqData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface Challans {
  createdAt: string;
  challan_number: number;
  _id: string;
  size: string;
  type: string;
  color: string;
  quantity: number;
  weight: number;
  remarks: string;
  userId: string;
  sub_total: number;
  date: string;
  from: string;
  phone_number: string;
}

export interface CreateChallanReqData {
  userId: string;
  challan_number: number;
  date: string;
  data: CreateChallanReqDataObject[];
}

export interface getChallans {
  challan: Challans[];
  result: {
    totalWeight: number;
    totalQuantity: number;
  };
}
export interface getCompany {
  company: Company[];
}
export interface CreateChallanData {
  userId: string;
  challan_number: number;
  date: string;
  from: string;
}

export interface EditChallanData {
  _id: string;
  userId: string;
  challan_number: number;
  date: Date;
  from: string;
  size: string;
  type: string;
  color: string;
  quantity: number;
  weight: number;
  remarks: string;
}
export interface Company {
  _id: string;
  userId: string;
  name: string;
  gst: string;
  phone: string;
  isDispatch: Boolean;
  createdAt: string;
}

export interface GetDropDown {
  type: string;
  search: string;
}

export interface DropDown {
  _id: string;
  name: string;
  userId: string;
}

export interface DropDownFilter {
  type: DropDown[];
  color: DropDown[];
  from: DropDown[];
  size: DropDown[];
}

export interface CreateChallanReqDataObject {
  size: string;
  type: string;
  color: string;
  quantity: number;
  weight: number;
  remarks: string;
}

export interface RawMaterialFilter {
  challanNumberFilter: number;
  startDate: string;
  endDate: string;
  fromFilter: string[];
  sizeFilter: string;
  typeFilter: string[];
  colorFilter: string[];
  [key: string]: string[] | string | number;
}
