import React from "react";
import { useSelector } from 'react-redux'
import './UserBar.css'
// import LogoutButton from './auth/LogoutButton';
import LogoutButton from '../auth/LogoutButton'
function UserBar(){

   const user = useSelector(state => state.session.user)

   return (
      <div id="userbar__container">
            {user.username}
            <LogoutButton />
      </div>
   )
}

export default UserBar;
