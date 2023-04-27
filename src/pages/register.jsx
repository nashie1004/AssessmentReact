import { useContext, useState } from "react";
import { BASE, Data } from "../App";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const {login} = useContext(Data)
  const redirect = useNavigate()

  async function handleSubmit(e){
    e.preventDefault();
    if (name && password){
      const res = await fetch(BASE + "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name, password, 
        })
      })
      if (res.status === 200) {
        redirect('/login')
      }
      else alert('Error in registering user')
    }
  }

  return (
    <div className='Register'>
      {
        !login ? (
          <>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder='Name' onChange={e => setName(e.target.value)} />
              <input type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} />
              <button>Register</button>
            </form>
          </>
        ) : (
          <>
            <h1>Register - Already Logged in</h1>
          </>
        )
      }
    </div>
  )
}
