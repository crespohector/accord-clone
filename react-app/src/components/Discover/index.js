import React, { useState, useEffect } from "react";
// import {getServers, joinServer} from "../../store/discover";
import { getServers } from "../../store/servers";
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import UserBar from "../UserBar"
import About from "../auth/About"
import './Discover.css'

function Discover() {

   const dispatch = useDispatch()
   let history = useHistory();

   const [serverId, setServerId] = useState(null)
   const user = useSelector(state => state.session.user);
   const servers = Object.values(useSelector(state => state.servers.allServers));

   useEffect(() => {
      dispatch(getServers())
   }, [dispatch])

   const joinServerSubmit = (e) => {
      e.preventDefault();
      history.push(`/servers/${serverId}`)
   }

   return (
      <div id="discover--container">
         <div id="discover__sidebar">
            <h1 id="discover__sidebar--title">Discover</h1>
         </div>
         <UserBar />
         <div id="discover">
            <div id="discover__svg--container">
               <div id="discover--svg">
                  <h1 id="discover__svg--title">Servers</h1>
               </div>
            </div>
            <div id="discover__servers">
               {servers.map((server) => (
                  <form key={server.id} onSubmit={joinServerSubmit} id="join__form">
                     <input type="hidden" name="user_id" value={user.id}></input>
                     <input type="hidden" name="server_id" value={server.id}></input>
                     <div className="server__container">
                        <div className="server__container--img">
                           <img src={`data:image/jpeg;base64,${server?.img_url}`}></img>
                        </div>
                        <div className="server__container--title">{server.name}</div>
                        <button type="submit" onClick={() => setServerId(server.id)} className="server__container--button">Join</button>
                     </div>
                  </form>
               ))}
            </div>
         </div>
         <button className="about-btn">
            <About />
         </button>
      </div>
   )
}

export default Discover;
