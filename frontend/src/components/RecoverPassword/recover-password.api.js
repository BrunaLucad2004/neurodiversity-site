import { api } from "../../services/api";

export const recoverPassword = async (email) => api.post('/users/recover-password', { email });