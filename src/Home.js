import React from 'react';
import useLogout from './hooks/useLogout';

const Home = () => {
  const logout = useLogout();

  const signOut = async () => {
    await logout();
  };

  return <div>Home</div>;
};

export default Home;
