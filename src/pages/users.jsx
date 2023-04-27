import { BASE, Data } from '../App'
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'

export default function Users() {
  const {login, currentLoggedInUserInfo} = useContext(Data)
    const [users, setUsers] = useState([])

  useEffect(() => {
    if (document.cookie !== ''){
        fetch(BASE + "/getAllUsers").then(res => res.json()).then(data => {
            setUsers(data.all)
        })
    }
  }, [])

  return (
    <div className='Users'>
        {
            login ? (
                <>
                    <h1>Users:</h1>
                    {
                        users.map((item, i) => {
                            if (item.name !== currentLoggedInUserInfo.name){

                                let LINK = ''
                                if (currentLoggedInUserInfo.name < item.name){
                                    LINK = `${currentLoggedInUserInfo.name}-${item.name}`
                                } else {
                                    LINK = `${item.name}-${currentLoggedInUserInfo.name}`
                                }

                                return <div key={i} className='users-row'>
                                    <h2>
                                        <Link to={`/users/${LINK}`}>{item.name}</Link>
                                    </h2>
                                </div>
                            }
                        })
                    }
                </>
            ) : (
                <>
                    <h1>Users - Not Logged In</h1>
                    <h2>
                        <Link to='/register'>Register or </Link>
                        <Link to='/login'>Login</Link>
                    </h2>
                </>
            )
        }
    </div>
  )
}
