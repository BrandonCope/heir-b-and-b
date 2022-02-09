import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SignUpFormModal from '../SignupFormModal';
import './Navigation.css';
// import SpotHostForm from '../SpotsHostForm';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div>
        <NavLink to={"/spots/new"}>Host a spot!</NavLink>
        <ProfileButton user={sessionUser} />
      </div>
    );
  } else {
    sessionLinks = (
      <>
        <LoginFormModal />
        <SignUpFormModal />
      </>
    );
  }

  return (

    <ul className='navBar'>
        <NavLink exact to="/">🏠</NavLink>
        <div className='sessionLinks'>
        {isLoaded && sessionLinks}
        </div>

    </ul>
  );
}

export default Navigation;
