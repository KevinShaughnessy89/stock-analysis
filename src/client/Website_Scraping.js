import { userApi } from '../api/userApi.js';


export async function getCompanyList() {
  const data = userApi.getNames();
  return data;
}
