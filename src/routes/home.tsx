import React from 'react';
import { auth } from './firebase';

const Home = () => {
  const logOut = () => {
    auth.signOut();
  }
  return (
    <h1>
      <button onClick={logOut}>Logout</button>
    </h1>
  );
};

export default Home;