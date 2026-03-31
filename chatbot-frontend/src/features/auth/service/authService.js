import api from "../../../api/AxiosConfig";


async function registerUser(email, password) {
    const response = await api.post("/auth/register", {email, password})
    return response.data
}

async function loginUser(email, password) {
  const response = await api.post("/auth/login", { email, password })
  return response.data
}

export { registerUser, loginUser }