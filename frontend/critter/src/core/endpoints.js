import axios from 'axios' 

export const media = process.env.REACT_APP_PUBLIC_URL

export const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
})

export default api
