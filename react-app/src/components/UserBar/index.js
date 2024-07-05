import React from "react";
import { useSelector } from 'react-redux'
import './UserBar.css'
import LogoutButton from '../auth/LogoutButton'

function UserBar(){
   const user = useSelector(state => state.session.user)

   return (
      <div id="userbar__container">
         <div>
            <img src={`data:image/jpeg;base64,${user?.profile_picture}`} alt="profile image" />
            {user.username}
         </div>
            <LogoutButton />
      </div>
   )
}

export default UserBar;
