import { useState, useRef, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
const AdminChat = ({socket}) => 
{
    const uploadingServer = import.meta.env.VITE_UPLOADING_SERVER
    const  {u_username, u_role, u_profile_picture} = useOutletContext()
    const [messagesRecieved, setMessagesReceived] = useState([]);
    const messagesColumnRef = useRef(null); // Add this
    const [message, setMessage] = useState('');


    const sendMessage = (e) =>
    {
      e.preventDefault()
      if (message !== '') {
        const __createdtime__ = Date.now();
        // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
        socket.emit('send_message', { username:u_username, role:u_role, message, __createdtime__, picture:u_profile_picture});
        setMessage('');
      }
    }


//  For Welcoming!
    useEffect(() => {
      socket.on('receive_message', (data) => {
        console.log(data);
        setMessagesReceived((state) => [
          ...state,
          {
            message: data.message,
            username: data.username,
            __createdtime__: data.__createdtime__,
            role: data.role,
            picture:data.picture
          },
        ]);
      });
      return () => socket.off('receive_message');

    }, [socket]);
  
    
  
        // Add this
    useEffect(() => {
      // Last 100 messages sent in the chat room (fetched from the db in backend)
      socket.on('last_100_messages', (last100Messages) => {
        // Sort these messages by __createdtime__
        last100Messages = sortMessagesByDate(last100Messages);
        setMessagesReceived((state) => [ ...state, ...last100Messages]);
      });
  
      return () => socket.off('last_100_messages');
    }, [socket]);
  
    // Add this
    // Scroll to the most recent message
    // useEffect(() => {
    //   messagesColumnRef.current.scrollTop =
    //     messagesColumnRef.current.scrollHeight;
    // }, [messagesRecieved]);
  
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
    return(
        <div className="AdminChat">
              <div className="AdminMessage">
                <div className="active">
                  <h4> <span>Currently Active</span> </h4>
                  <div className="active-people">
                      <h1>•</h1>
                      <h5>Ralph</h5>
                  </div>
                  <div className="active-people">
                      <h1>•</h1>
                      <h5>Ralph</h5>
                  </div>
                  <div className="active-people">
                      <h1>•</h1>
                      <h5>Ralph</h5>
                  </div>
                </div>
        
                <div className="message-container">
                  <div className="convo" ref={messagesColumnRef}>
                    {messagesRecieved.map((message, i) => {
                      return(
                        <div className="convo-box" key={i}>
                        <div className="convo-header">
                          <div className="first-column">
                          <img src={`${uploadingServer}${u_profile_picture}`} alt="" />
                          <div className="title">
                          <h4>{message.username}</h4>
                          <p>{message.role}</p>
                          </div>
                          </div>


                          <p>{ formatDateFromTimestamp(message.__createdtime__? message.__createdtime__:message.timesent) }</p>
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
                      <form onSubmit={(e)=>{sendMessage(e)}}>
                      <input type="text" placeholder="Enter Message" onChange={(e)=> {setMessage(e.currentTarget.value)}}/>
                      <button type="submit">Send <span>Message</span> </button>
                      </form>
 
                    </div>
        
                  </div>
                </div>
        
              </div>
              </div>

    )
}

export default AdminChat