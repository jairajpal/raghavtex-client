import axios, { AxiosInstance } from "axios";
import {
  AuthUserData,
  CommonApiResponse,
  CreateChallanReqData,
  LoginReqData,
  RawMaterialFilter,
  Challans,
  RegisterReqData,
  GetDropDown,
  DropDown,
  DropDownFilter,
  EditChallanData,
  getChallans,
  Company,
  getCompany,
} from "./types";
import { getGlobalItem } from "@/utils/local-storage";
const accessToken = getGlobalItem("user")?.access_token;

export const instance = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    authorization: "Bearer " + accessToken,
  },
});

export const setInstance = (instance: AxiosInstance) => {
  instance.defaults.headers["authorization"] =
    "Bearer " + getGlobalItem("user")?.access_token;
};

export const login = async (
  loginData: LoginReqData,
  login_by = "normal"
): Promise<CommonApiResponse<AuthUserData>> => {
  const { data } = await instance.post(`login-user/${login_by}`, loginData);
  return data;
};

export const registerAccount = async (
  registerData: RegisterReqData
): Promise<CommonApiResponse<AuthUserData>> => {
  const { data } = await instance.post("add-user", registerData);
  return data;
};

export const getAllChallan = async (
  userId: string,
  filters: RawMaterialFilter,
  isDispatch: boolean
): Promise<CommonApiResponse<getChallans>> => {
  const { data } = await instance.get("get-challan", {
    params: {
      ...filters,
      isDispatch,
      userId: userId,
    },
  });
  return data;
};

export const getAllCompany = async (
  userId: string
): Promise<CommonApiResponse<getCompany>> => {
  const { data } = await instance.get("get-company", {
    params: {
      userId: userId,
    },
  });
  return data;
};

export const getDropDown = async (
  userId: string,
  filters: GetDropDown,
  isDispatch: boolean
): Promise<CommonApiResponse<DropDown[]>> => {
  const { data } = await instance.get("get-dropdown", {
    params: {
      ...filters,
      isDispatch,
      userId,
    },
  });
  return data;
};

export const getDropDownFilter = async (
  userId: string,
  isDispatch: boolean
): Promise<CommonApiResponse<DropDownFilter>> => {
  const { data } = await instance.get("get-dropdownfilter", {
    params: {
      userId: userId,
      isDispatch,
    },
  });
  return data;
};

export const editChallan = async (
  challanData: EditChallanData
): Promise<CommonApiResponse<EditChallanData>> => {
  const { data } = await instance.post("edit-challan", challanData);
  return data;
};

export const editCompany = async (
  companyData: Company
): Promise<CommonApiResponse<Company>> => {
  const { data } = await instance.post("edit-company", companyData);
  return data;
};

export const createChallan = async (
  challanData: CreateChallanReqData,
  isDispatch: boolean
): Promise<CommonApiResponse<Challans[]>> => {
  const { data } = await instance.post("add-challan", {
    ...challanData,
    isDispatch,
  });
  return data;
};
export const createCompany = async (
  companyData: Company
): Promise<CommonApiResponse<Company>> => {
  const { data } = await instance.post("add-company", {
    ...companyData,
  });
  return data;
};
