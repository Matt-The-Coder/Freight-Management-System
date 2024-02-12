import '/public/assets/css/adminLayout/adminChat.css'
import { useEffect, useState, useRef } from 'react'

const Message = ({ socket,username,room }) => {

  const [messagesRecieved, setMessagesReceived] = useState([]);
  const messagesColumnRef = useRef(null); // Add this
  const [message, setMessage] = useState('');
  const sendMessage = () =>
  {
    if (message !== '') {
      const __createdtime__ = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit('send_message', { username, room, message, __createdtime__ });
      setMessage('');
    }
  }
  // Runs whenever a socket event is recieved from the server
  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data);

      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    // Remove event listener on component unmount
    return () => socket.off('receive_message');
  }, [socket]);

  
    // Runs whenever a socket event is recieved from the server
    useEffect(() => {
      socket.on('chatroom_users', (data) => {
        console.log(data);
      });
      return () => socket.off('receive_message');
    }, [socket]);

      // Add this
  useEffect(() => {
    // Last 100 messages sent in the chat room (fetched from the db in backend)
    socket.on('last_100_messages', (last100Messages) => {
      console.log('Last 100 messages:', last100Messages);
      // Sort these messages by __createdtime__
      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    return () => socket.off('last_100_messages');
  }, [socket]);

  // Add this
  // Scroll to the most recent message
  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messagesRecieved]);

  // Add this
  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );}

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
  return (
    <>
      <div className="AdminMessage">
        <div className="active">
          Currently Active
        </div>

        <div className="message-container">
          <div className="convo" ref={messagesColumnRef}>
            {messagesRecieved.map((message, i) => {
              return(
                <div className="convo-box" key={i}>
                <div className="convo-header">
                  <h4>{message.username}</h4>
                  <p>{ formatDateFromTimestamp(message.__createdtime__)}</p>
                </div>
                <div className="convo-message">
                  <p>{message.message}</p>
                </div>
              </div>
              )

            })}

          </div>

          <div className="message">
            <div className="send-message">
              <input type="text" onChange={(e)=> {setMessage(e.currentTarget.value)}}/>
              <button onClick={sendMessage}>Send Message</button>
            </div>

          </div>
        </div>

      </div>

    </>
  )
}

export default Message