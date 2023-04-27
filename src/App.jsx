import React from 'react'
import {io} from 'socket.io-client'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {useState, useEffect, createContext } from 'react'

import Register from './pages/register'
import Login from './pages/login'
import Chat from './pages/chat'
import Users from './pages/users'
import Nav from './Nav'

export const BASE = 'https://aschatexpress.onrender.com'
export const socket = io(BASE) 
export const Data = createContext()

export default function App() {
  const [login, setLogin] = useState(false)
  const [currentLoggedInUserInfo, setCurrentLoggedInUserInfo] = useState({})

  useEffect(() => {
    if (document.cookie === ''){
      setLogin(false)
      setCurrentLoggedInUserInfo({})
    } else {
      fetch(BASE + `/verify/${
        document.cookie.split(';')[1].split('=')[1]
      }`).then(res => res.json()).then(data => {
        setLogin(true)
        setCurrentLoggedInUserInfo(data.verified)
      })
    }
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Data.Provider value={{
          login, setLogin, currentLoggedInUserInfo, setCurrentLoggedInUserInfo
        }}>
          <Nav />
          <Routes>
            <Route path='/' element={<Users />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/users/:id' element={<Chat />} />
          </Routes>
        </Data.Provider>
      </BrowserRouter>
    </div>
  )
}
