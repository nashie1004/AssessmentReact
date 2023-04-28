import { Data, BASE, socket } from '../App'
import { useContext, useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function Chat() {
  const {login, currentLoggedInUserInfo} = useContext(Data)
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const savedMessagesUseRef = useRef([]);
  const params = useParams();

  const owner = document.cookie.split(';')[1].split('=')[1]
  const to = document.cookie.split(';')[1].split('=')[1] === params.id.split('-')[0] ? params.id.split('-')[1] : params.id.split('-')[0];

  socket.off('sendMessageToClient').on('sendMessageToClient', data => {
    setMessages(prev => {
        savedMessagesUseRef.current = [...prev, data]
        return [...prev, data]
      })
  })

  socket.off('saveConvo').on('saveConvo', data => {
    if (data.length !== 0){
      savedMessagesUseRef.current = data
      setMessages(data)
    }
  })

  function handleSubmit(){
    if (currentMessage !== ''){
      
      socket.emit('sendMessageToServer', {
        name: to,
        message: currentMessage, 
        date: new Date().toLocaleTimeString(), room: params.id,
      })
      setCurrentMessage('')
    }
  }

  useEffect(() => {

    if (document.cookie !== ''){
      socket.emit('joinRoom', params.id)

      fetch(BASE + `/getInitialMessages/${owner}/${to}`).then(res => 
        res.json()).then(data => {
          if (!data.user.history.hasOwnProperty(to)){
            data.user.history[to] = []
            setMessages(data.user.history[to])
          } else {
            setMessages(data.user.history[to])
          }
      })
  
      return async () => {
        socket.emit('disconnectCleanup', {
          room: params.id,
          owner: owner,
          to: to,
          messages: savedMessagesUseRef.current
        })
      }
    }
  }, [])

  return (
    <div className='Chat'>
    {
      login ? (
        <> 
          <input type="text" placeholder='Message'
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <button onClick={handleSubmit}>Send Message</button>
          <div className='messages-container'>
            {
              messages && messages.map((item, i) => {
                return <div key={i} className={document.cookie.split(';')[1].split('=')[1] === item.name ? "owner" : "to"}>
                  {document.cookie.split(';')[1].split('=')[1] === item.name ? 'You' : item.name}: {item.message} - {item.date}
                </div>
              })
            }
          </div>
        </>
      ) : (
        <>
          <h1>Chatroom - Not Logged In</h1>
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
