import axios from 'axios'

const axiosPublic = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api/v1',
  baseURL: 'https://bestthaideal.elegantinternational.site/public/api/v1/portfolio',
})

const useAxiosPublic = () => {
  return axiosPublic
}

export default useAxiosPublic
