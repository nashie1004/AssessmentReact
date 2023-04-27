import { useContext, useState } from "react";
import { BASE } from "../App";
import { useNavigate } from "react-router-dom";
import { Data } from "../App";

export default function Login() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const redirect = useNavigate()
  const {setLogin, login, setCurrentLoggedInUserInfo} = useContext(Data)

  async function handleSubmit(e){
    e.preventDefault();
    if (name && password){
      const res = await fetch(BASE + "/login", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json"
        }, withCredentials: true, 
        body: JSON.stringify({
          name, password, 
          
        }) 
      }) 
      if (res.status === 200) {
        const data = await res.json();
        setLogin(true)
        setCurrentLoggedInUserInfo(data.found)
        // set session expires in 24h
        document.cookie = `session_id=${data.token}; max-age=86400; path=/;`
        // set user info expires in 24h
        document.cookie = `profile_name=${data.found.name}; max-age=86400; path=/;`
        
        redirect('/')
      }
      else alert('Error in Login')
    }
  }

  return (
    <div className='Login'>
      {
        !login ? (
          <>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder='Name' onChange={e => setName(e.target.value)} />
              <input type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} />
              <button>Login</button>
            </form>
          </>
        ) : (
          <>
            <h1>Login - Already Logged in</h1>
          </>
        )
      }
    </div>
  )
}
