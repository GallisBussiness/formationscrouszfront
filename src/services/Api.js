import axios from "axios";
const Api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND,
  })
  Api.interceptors.request.use(config => {
    const token = window.localStorage.getItem(process.env.REACT_APP_TOKENSTORAGENAME);
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  Api.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if(error.response.status === 440){
      localStorage.removeItem(process.env.REACT_APP_TOKENSTORAGENAME);
      window.location.reload();
    }
    return Promise.reject(error);
  });
export default Api;