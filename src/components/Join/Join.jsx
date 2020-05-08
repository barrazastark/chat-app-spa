import React, { useState, useRef, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";

import "./Join.scss";

const blockName = "join-wrapper";

const Join = ({ username, room, onChangeUsername, onChangeRoom, history }) => {

  const userNameRef = useRef(null);
  const roomRef = useRef(null);

  const [focused, setFocused] = useState("username");

  useEffect(() => {
    userNameRef.current.focus();
  }, []);

  const handleClickInputBox = ref => {
    if(focused !== ref.id){
      ref.current.focus();
      setFocused(ref.id);
    }
  }

  const handleKeyPress = e => {
    if(e.key === "Enter" && username && room && e.target.id === "room"){
      history.push("/chat");
    }
    else if(e.key === "Enter"){
      roomRef.current.focus();
    }
  };

  return (
    <div className={blockName}>
      <h1>Welcome</h1>
        <div className={`${blockName}__group`} onClick={() => handleClickInputBox(userNameRef)}>
          <input
            type="text"
            onChange={onChangeUsername}
            ref={userNameRef}
            value={username}
            onKeyPress={handleKeyPress}
            id="username"
          />
          <label>Username:</label>
        </div>
        <div className={`${blockName}__group`} onClick={() => handleClickInputBox(roomRef)}>
          <input
              type="text"
              onChange={onChangeRoom}
              ref={roomRef}
              value={room}
              id="room"
              onKeyPress={handleKeyPress}
            />
          <label>Room:</label>
        </div>
      <Link
        onClick={(e) => (!username || !room ? e.preventDefault() : null)}
        to={`/chat`}
      >
        Go
      </Link>
    </div>
  );
};

export default withRouter(Join);
