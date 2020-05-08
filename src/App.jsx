import React, { lazy, Suspense, useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import "./App.scss";

const Join = lazy(() => import("./components/Join"));
const List = lazy(() => import("./components/List"));
const Chat = lazy(() => import("./components/Chat"));


const App = () => {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);

  const handleChangeUserName = e => {
    setUsername(e.target.value);
  }

  const handleChangeRoom = e => {
    setRoom(e.target.value);
  }

  const handleChangeUsers = users => {
    setUsers(users);
  }

  return (
    <Suspense fallback={<p>Loading page...</p>}>
      <Router>
        <Route path="/" exact >
          <Join 
            username={username} 
            room={room} 
            onChangeRoom={handleChangeRoom} 
            onChangeUsername={handleChangeUserName}
          />
        </Route>
        <Route path="/chat">
          <div className="chat-main-wrapper">
            <List users={users} />
            <Chat username={username} room={room} onChangeUsers={handleChangeUsers}/>
          </div>
        </Route>
        <Redirect from="*" to="/" component={Join} />
      </Router>
    </Suspense>
  )
  
};

export default App;
