import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

/* eslint-disable react/prop-types */
function Chats({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  async function sendMessage() {
    if (!currentMessage) return;

    const id = crypto.randomUUID();
    const messageData = {
      id,
      room,
      author: username,
      message: currentMessage,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    await socket.emit("send_message", messageData);
    setMessageList((list) => [...list, messageData]);

    setCurrentMessage("");
  }

  useEffect(
    function () {
      socket.on("receive_message", (data) => {
        setMessageList((list) => [...list, data]);
      });

      // CLEAN UP Function
      return function () {
        socket.removeListener("receive_message");
      };
    },
    [socket]
  );

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat 🟢 </p>;
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((message) => {
            return (
              <div
                className="message"
                id={username === message.author ? "you" : "other"}
                key={message.id}
              >
                <div>
                  <div className="message-content">
                    <p>{message.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{message.time}</p>
                    <p id="author">{message.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Hey..."
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chats;
