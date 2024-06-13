import React, { useEffect, useState } from "react";
import { NavLink, useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateServer, getServer } from "../../store/servers"

// UPDATE - perform an update on a server

function Update() {
   let dispatch = useDispatch()
   let history = useHistory()
   const { id } = useParams();
   const server = useSelector((state) => {
      return state.servers.currentServer;
   });

   const [imgUrl, setImgUrl] = useState("");
   const [serverName, setServerName] = useState("");

   const updateServ = (e) => {
      e.preventDefault();
      dispatch(updateServer(id, imgUrl, serverName))
      history.push(`/servers/${server?.id}`)
   }

   useEffect(() => {
      dispatch(getServer(id))
   }, [dispatch])

   return (
      <div id="delete__container">
            <form onSubmit={updateServ}>
               <h1 id="server__question">Do you want to update server {server?.name}?</h1>

               <label className="form_label">Image Url</label>
               <input type="text" name="image_url" className="form-input" onChange={e => setImgUrl(e.target.value)} required></input>

               <label className="form_label">Server Name</label>
               <input type="text" name="server_name" className="form-input" onChange={e => setServerName(e.target.value)} required></input>

               <button type="submit" id="delete" className="delete__buttons">Submit</button>
               <NavLink to={`/servers/${server?.id}`}>
                  <button id="cancel" className="delete__buttons">Cancel</button>
               </NavLink>
            </form>
      </div>
   )
}

export default Update;
