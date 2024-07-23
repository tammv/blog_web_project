import React, { useState, useContext, useEffect, useRef } from 'react';
import { Avatar, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Input } from '@material-ui/core';
import { SearchOutlined, Chat } from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SidebarChat from '../SidebarChat/SidebarChat';
import './Sidebar.css';
import { db, storage } from '../../../firebase';
import { AuthContext } from '../../../redux/auth-context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ref as dbRef, set, push, onValue } from 'firebase/database';
import { ref as storageRef, getDownloadURL, uploadBytes } from 'firebase/storage';

function Sidebar() {
    const authContext = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [enteredFilter, setEnteredFilter] = useState('');
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [file, setFile] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const inputRef = useRef();

    useEffect(() => {
        const roomsRef = dbRef(db, 'rooms');
        const unsubscribe = onValue(roomsRef, (snapshot) => {
            const user = JSON.parse(localStorage.getItem('user')) || authContext.user;
            const roomsData = [];
            snapshot.forEach((childSnapshot) => {
                const roomData = childSnapshot.val();
                if (roomData.members && roomData.members.includes(user.uid)) {
                    roomsData.push({
                        id: childSnapshot.key,
                        data: roomData,
                    });
                }
            });
            setRooms(roomsData);
        });

        return () => unsubscribe();
    }, [authContext.user]);

    useEffect(() => {
        const filtered = rooms.filter(room => room.data.name.toLowerCase().includes(enteredFilter.toLowerCase()));
        setFilteredRooms(filtered);
    }, [enteredFilter, rooms]);

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const addNewChat = async () => {
        if (!newRoomName.trim()) {
            toast.error("Please enter a room name.");
            return;
        }

        let imageUrl = "";
        if (file) {
            try {
                const fileRef = storageRef(storage, `room_images/${file.name}`);
                const snapshot = await uploadBytes(fileRef, file);
                imageUrl = await getDownloadURL(snapshot.ref);
            } catch (error) {
                toast.error("Failed to upload image: " + error.message);
                return; // Ensure we don't proceed if there's an error
            }
        }

        try {
            const user = JSON.parse(localStorage.getItem('user')) || authContext.user;
            const newRoomRef = push(dbRef(db, 'rooms'));
            await set(newRoomRef, {
                name: newRoomName,
                image: imageUrl || 'https://i.pinimg.com/564x/41/66/cd/4166cd94bd5b55d158a39e81b20a950a.jpg',
                members: [user.uid],
            });
            toast.success("New room added successfully!");
            handleDialogClose();
        } catch (error) {
            toast.error("Error adding room: " + error.message);
        }
    };

    const logout = () => {
        authContext.logout();
        setAnchorEl(null);
        navigate("/");
    };

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar className="sidebar__avatar" src={authContext.user && authContext.user.photoURL} />
                <div className="sidebar__headerRight">
                    <IconButton onClick={handleDialogOpen}>
                        <Chat />
                    </IconButton>

                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">

                    <input
                        ref={inputRef}
                        placeholder="Search chat room"
                        type="text"
                        value={enteredFilter}
                        onChange={event => setEnteredFilter(event.target.value)}
                    />
                </div>
            </div>
            <div className="sidebar__search_bottom">
            </div>
            <div className="sidebar__chats">
                {!enteredFilter ? rooms.map(room => (
                    <SidebarChat key={room.id} id={room.id} name={room.data.name} />
                )) : filteredRooms.map(room => (
                    <SidebarChat key={room.id} id={room.id} name={room.data.name} />
                ))}
            </div>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Add a New Chat Room</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="name" style={{ marginBottom: '10px' }}>
                            Name 
                        </InputLabel>
                        <Input
                            id="name"
                            value={newRoomName}
                            onChange={e => setNewRoomName(e.target.value)}
                            autoFocus
                        />
                    </FormControl>
                    
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ marginTop: 20 }} // Optionally style the file input
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">Cancel</Button>
                    <Button onClick={addNewChat} color="primary">Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Sidebar;
