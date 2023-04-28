import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { Data,  } from "./App"

export default function Nav() {
  const {login, setLogin, currentLoggedInUserInfo, setCurrentLoggedInUserInfo} = useContext(Data)
  const redirect = useNavigate();

  return (
    <div className="Nav">
      {
        login ? (
          <>
            <div>
              <h3>{currentLoggedInUserInfo.name}</h3>
            </div>
            <Link to='/'><h3>Home</h3></Link>
            <button onClick={() => {
              //delete cookies
              document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              document.cookie = "profile_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              setLogin(false)
              setCurrentLoggedInUserInfo({})
              redirect('/login')
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to='/'><h3>Home</h3></Link>
            <Link to='/login'><h3>Login</h3></Link>
            <Link to='/register'><h3>Register</h3></Link>
          </>          
        )
      }
    </div>
  )
}
