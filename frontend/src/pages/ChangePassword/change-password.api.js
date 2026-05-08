import { api } from "../../services/api";

export const changePassword = async ({authKey, password}) => api.patch(`/users/change-password?authKey=${authKey}`, { password });