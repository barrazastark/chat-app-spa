import React, { useState, useEffect, memo, useRef } from "react";
import io from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import ReactEmoji from "react-emoji";
import cx from "classnames";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

import Smile from "./Smile";
import Close from "./Close";
import Send from "./Send";

import "./Chat.scss";

const blockName = "chat-wrapper";
let socket;

const ENDPOINT = process.env.NODE_ENV === "development" ?  "localhost:5000" : "https://chat-app-with-sockets.herokuapp.com/";

const Chat = ({ room, username, onChangeUsers }) => {
  
  const messageRef = useRef(null);
  const [message, setMessage] = useState("");
  const [displayPicker, setDisplayPicker] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io(ENDPOINT);

    // didMount
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    messageRef.current.focus();

    // willUnMount
    return () => {
      socket.emit("disconnect");
      socket.off();
    };

  },[]);

  useEffect(() => {
    socket.emit("join", { name: username, room });
  }, [username, room]);

  useEffect(() => {
    socket.on("roomData", ({ users }) => {
      onChangeUsers(users);
  });
  }, [onChangeUsers])

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => {
        setMessage("");
        setDisplayPicker(false);
      });
    }
  };

  const handleSelecteIcon = ({ native }) => {
    setMessage(message+native);
    messageRef.current.focus();
  }

  const handleTogglePicker = flag => {
    setDisplayPicker(flag);
    messageRef.current.focus();
  }

  return (
    <div className={blockName}>
      <h1>Room: {room}</h1>
      <ScrollToBottom className={`${blockName}__chat-box`}>
         {messages.map(({ user, text }, key) => (
           <p 
            key={key} 
            className={cx(`${blockName}__message`, 
              { 
                [`${blockName}__message-self`]: user === username, 
                [`${blockName}__message-other`]: user !== username && user !== "super-admin",
                [`${blockName}__message-super-admin`]: user === "super-admin",
              }
            )}
          >
             {user !== "super-admin" && user !== username && <span>{user}</span>}
             <span>{ReactEmoji.emojify(text)}</span>
           </p>
         ))}
      </ScrollToBottom>
      <div className={`${blockName}__bottom`}>
        { displayPicker && <Picker className={`${blockName}__picker`} onSelect={handleSelecteIcon}/> }
        <div className={`${blockName}__picker-toggle`}>
          {displayPicker && <Close onClick={() => handleTogglePicker(false)}/>}
          <Smile open={displayPicker} onClick={() => handleTogglePicker(true)}/>
        </div>
        <input
          ref={messageRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
        />
        <Send onClick={(e) => sendMessage(e)} />
      </div>
     
    </div>
  );
};

export default memo(Chat);
