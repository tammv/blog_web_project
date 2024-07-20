import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Components/Sidebar/Sidebar';
import Chat from './Components/Chat/Chat';
import AuthContextProvider  from '../redux/auth-context';
import './RoomRoutes.css'; 

function RoomRoutes() {
  return (
    <div className="app">
      <div className="app__body">
        <Routes>
          <Route path=":roomId" element={<><Sidebar /><Chat /></>} />
          <Route path="/" element={<Sidebar />} />
        </Routes>
      </div>
    </div>
  );
}

export default RoomRoutes;
