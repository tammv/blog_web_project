import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './SidebarChat.css';
import { db } from '../../../firebase';
import { NavLink } from 'react-router-dom';
import { Image } from '@material-ui/icons';
import { ref, onValue, orderByChild, query, limitToLast } from 'firebase/database';

function SidebarChat({ id, name }) {
    const [seed, setSeed] = useState('');
    const [messages, setMessages] = useState([]);
    const [roomImage, setRoomImage] = useState('');

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    useEffect(() => {
        if (id) {
            const messagesRef = query(ref(db, `rooms/${id}/messages`), orderByChild('timestamp'), limitToLast(1));
            const unsubscribe = onValue(messagesRef, (snapshot) => {
                const msgs = [];
                snapshot.forEach((childSnapshot) => {
                    msgs.push(childSnapshot.val());
                });
                setMessages(msgs);
            });

            return () => unsubscribe();
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            const roomRef = ref(db, `rooms/${id}`);
            const unsubscribe = onValue(roomRef, (snapshot) => {
                const roomData = snapshot.val();
                setRoomImage(roomData.image);
            });

            return () => unsubscribe();
        }
    }, [id]);

    return (
        <NavLink to={`/rooms/${id}`} activeClassName="sidebarChat__active">
            <div className="sidebarChat">
                <Avatar src={roomImage || 'https://via.placeholder.com/150'} />
                <div className="sidebarChat__info">
                    <h3>{name}</h3>
                    <p>{messages[0]?.message ? messages[0].message.substring(0, 20) + '...' : <Image />}</p>
                </div>
            </div>
        </NavLink>
    );
}

export default SidebarChat;
