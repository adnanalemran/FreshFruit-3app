import { useState, useLayoutEffect } from 'react'

const useAuth = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const isAuth = () => {
    return localStorage.getItem('token') !== null
  }

  const getToken = () => {
    return localStorage.getItem('token')
  }

  const getRole = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.role || 0
  }

  const setToken = (token: string) => {
    localStorage.setItem('token', token)
  }

  const removeToken = () => {
    localStorage.removeItem('token')
  }

  const storeUser = (user: object) => {
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  const removeUser = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  useLayoutEffect(() => {
    const storedUser = localStorage.getItem('user')
    setUser(storedUser ? JSON.parse(storedUser) : null)
  }, [])

  return {
    isAuth,
    getToken,
    setToken,
    storeUser,
    removeUser,
    removeToken,
    user,
    setUser,
    getRole,
  }
}

export default useAuth
