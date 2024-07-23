import { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Avatar,
    IconButton,
    Popover,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    FormControl,
    MenuItem,
    InputLabel,
    Select,
    Checkbox,
} from '@material-ui/core';
import {
    AttachFile,
    DoubleArrow,
    InsertEmoticon,
    Mic,
    People,
    ExitToApp,
    Settings,
} from '@material-ui/icons';
import { db, storage } from '../../../firebase';
import { AuthContext } from '../../../redux/auth-context';
import { toast } from 'react-toastify';
import {
    ref,
    get,
    set,
    update,
    push,
    onValue,
    serverTimestamp,
    query,
    orderByChild,
} from 'firebase/database';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Spinner from '../Spinner/Spinner';
import { format } from 'date-fns';
import './Chat.css';

const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new speechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-US';

function Chat({ setSelectedImage }) {
    const [input, setInput] = useState('');
    const [seed, setSeed] = useState('');
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState('');
    const [files, setFiles] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [color, setColor] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef();
    const [roomImage, setRoomImage] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openSettingsDialog, setOpenSettingsDialog] = useState(false); // Thêm state cho dialog cài đặt
    const [members, setMembers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en-US'); // State cho ngôn ngữ đã chọn

    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (roomId) {
            const roomRef = ref(db, `rooms/${roomId}`);
            onValue(roomRef, (snapshot) => {
                const roomData = snapshot.val();
                setRoomName(roomData.name);
                setRoomImage(roomData.image);

                if (Array.isArray(roomData.members)) {
                    fetchMembersDetails(roomData.members);
                } else {
                    console.error('Members field is not an array:', roomData.members);
                }
            });

            const messagesQuery = query(
                ref(db, `rooms/${roomId}/messages`),
                orderByChild('timestamp')
            );
            onValue(messagesQuery, (snapshot) => {
                const msgs = [];
                snapshot.forEach((childSnapshot) => {
                    msgs.push(childSnapshot.val());
                });
                setMessages(msgs);
            });
        }
    }, [roomId]);

    const fetchMembersDetails = async (memberUids) => {
        try {
            const memberDetails = [];
            for (let uid of memberUids) {
                const userRef = ref(db, `users/${uid}`);
                const userSnapshot = await get(userRef);
                if (userSnapshot.exists()) {
                    memberDetails.push(userSnapshot.val());
                }
            }
            setMembers(memberDetails);
        } catch (error) {
            console.error('Error fetching member details:', error);
        }
    };

    const uploadFile = (file) => {
        return new Promise((resolve, reject) => {
            const fileRef = storageRef(storage, file.name);
            const uploadTask = uploadBytesResumable(fileRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                },
                (error) => {
                    toast.error(error.message, { position: 'top-center' });
                    reject(error);
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    const name = authContext.user.displayName;
                    const timestamp = serverTimestamp();
                    await push(ref(db, `rooms/${roomId}/messages`), { name, timestamp, url });
                    resolve();
                }
            );
        });
    };

    useEffect(() => {
        if (files.length > 0) {
            setIsLoading(true);
            const uploadPromises = files.map((file) => uploadFile(file));

            Promise.all(uploadPromises)
                .then(() => {
                    setIsLoading(false);
                    setFiles([]); // Reset files to avoid re-upload
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    }, [files, authContext.user, roomId]);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    useEffect(() => {
        bottomRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    }, [messages]);

    useEffect(() => {
        if (isListening) {
            mic.start();
            setColor({ color: 'green' });
            mic.onend = () => {
                mic.start();
            };
        } else {
            mic.stop();
            mic.onend = () => {
                setColor(null);
            };
        }

        mic.onstart = () => {
            console.log('mic on!!');
        };

        mic.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join('');
            setInput(transcript);
            mic.onerror = (e) => {
                console.log(e.error);
            };
        };
    }, [isListening]);

    const sendMessage = async (event) => {
        event.preventDefault();

        if (input.length > 0) {
            await push(ref(db, `rooms/${roomId}/messages`), {
                name: authContext.user.displayName,
                message: input,
                timestamp: serverTimestamp(),
            });
        } else {
            toast.error('please enter valid message', { position: 'top-center' });
        }

        setInput('');
    };

    const types = ['image/jpeg', 'image/png'];

    const imageUploadHandler = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const validFiles = selectedFiles.filter((file) => types.includes(file.type));

        if (validFiles.length > 0) {
            setFiles(validFiles);
            setIsLoading(true);
        } else {
            setFiles([]);
            toast.error('please select files of type jpeg/png', { position: 'top-center' });
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
        fetchAllUsers();
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSearchTerm('');
        setSelectedUsers([]);
    };

    const fetchAllUsers = async () => {
        try {
            const usersRef = ref(db, 'users');
            const usersSnapshot = await get(usersRef);
            const usersData = [];
            usersSnapshot.forEach((childSnapshot) => {
                usersData.push(childSnapshot.val());
            });
            setAllUsers(usersData);
        } catch (error) {
            console.error('Error fetching users: ', error);
            toast.error('Error fetching users', { position: 'top-center' });
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleUserToggle = (uid) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(uid)
                ? prevSelected.filter((id) => id !== uid)
                : [...prevSelected, uid]
        );
    };

    const handleAddMembers = async () => {
        try {
            const roomRef = ref(db, `rooms/${roomId}`);
            const roomSnapshot = await get(roomRef);
            const roomData = roomSnapshot.val();

            const newMembers = [...roomData.members, ...selectedUsers];
            await update(roomRef, { members: newMembers });

            fetchMembersDetails(newMembers);
            toast.success('Members added successfully!');
            handleDialogClose();
        } catch (error) {
            console.error('Error adding members: ', error);
            toast.error('Error adding members', { position: 'top-center' });
        }
    };

    const handleLeaveRoom = async () => {
        try {
            const roomRef = ref(db, `rooms/${roomId}`);
            const roomSnapshot = await get(roomRef);
            const roomData = roomSnapshot.val();

            const newMembers = roomData.members.filter(
                (member) => member !== authContext.user.uid
            );
            await update(roomRef, { members: newMembers });

            toast.success('You have left the room successfully!');
            setOpenLeaveDialog(false);
            navigate('/rooms'); // Navigate to the /rooms page
        } catch (error) {
            console.error('Error leaving room: ', error);
            toast.error('Error leaving room', { position: 'top-center' });
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const emojis = [
        '😃',
        '😆',
        '😅',
        '🤣',
        '😂',
        '🙂',
        '😍',
        '😘',
        '😡',
        '😢',
        '😭',
        '🥱',
        '😫',
        '😱',
        '🥳',
        '😴',
        '🥴',
        '😷',
        '🤤',
        '😒',
        '🤩',
        '😜',
        '😋',
    ];

    const emojiHandler = (emoji) => {
        setInput((prevInput) => prevInput + emoji);
        handleClose();
    };

    const filteredUsers = allUsers.filter(
        (user) =>
            user.keywords.some((keyword) =>
                keyword.includes(searchTerm.toLowerCase())
            ) && !members.some((member) => member.uid === user.uid)
    );

    const formatDate = (timestamp) => {
        if (!timestamp) {
            return 'Invalid date';
        }

        const date = new Date(timestamp);
        const now = new Date();
        const isToday = now.toDateString() === date.toDateString();
        const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

        if (isToday) {
            return format(date, 'HH:mm');
        } else if (isYesterday) {
            return `Yesterday at ${format(date, 'HH:mm')}`;
        } else {
            return format(date, 'dd/MM/yyyy HH:mm');
        }
    };

    const handleSettingsDialogOpen = () => {
        setOpenSettingsDialog(true);
    };

    const handleSettingsDialogClose = () => {
        setOpenSettingsDialog(false);
    };

    const handleLanguageChange = (event) => {
        const language = event.target.value;
        setSelectedLanguage(language);
        mic.lang = language;
    };

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={roomImage || 'https://via.placeholder.com/150'} />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>
                        last seen{' '}
                        {messages.length ? formatDate(messages[messages.length - 1]?.timestamp) : 'N/A'}
                    </p>
                </div>
                <IconButton onClick={handleSettingsDialogOpen}>
                    <Settings />
                </IconButton>
                <IconButton onClick={handleDialogOpen}>
                    <People />
                </IconButton>
                <IconButton onClick={() => setOpenLeaveDialog(true)}>
                    <ExitToApp />
                </IconButton>
            </div>

            <div className="chat__body">
                <div className="chat__messages">
                    {messages.map((message) =>
                        !message.url ? (
                            <p
                                key={message.timestamp}
                                className={`chat_message ${message.name === authContext.user.displayName && 'chat__receiver'
                                    }`}
                            >
                                <span className="chat__username">{message.name}</span>
                                {message.message}
                                <span className="chat__timestamp">{formatDate(message.timestamp)}</span>
                            </p>
                        ) : (
                            <div
                                key={message.timestamp}
                                className={`chat_Img ${message.name === authContext.user.displayName && 'chat__receiverImg'
                                    }`}
                            >
                                <span className="chat__usernameImg">{message.name}</span>
                                <img
                                    onClick={() => setSelectedImage(message.url)}
                                    className="chat__image"
                                    src={message.url}
                                    alt=""
                                />
                                <p className="chat__timestampImg">{formatDate(message.timestamp)}</p>
                            </div>
                        )
                    )}
                    {isLoading && (
                        <div className="chat_message chat__receiver">
                            <Spinner />
                        </div>
                    )}
                    <div ref={bottomRef}></div>
                </div>
            </div>

            <div className="chat__footer">
                <div>
                    <IconButton aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
                        <InsertEmoticon />
                    </IconButton>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <Typography className="chat__emojis">
                            {emojis.map((emoji) => (
                                <span className="chat__emoji" key={emoji} onClick={() => emojiHandler(emoji)}>
                                    {emoji}
                                </span>
                            ))}
                        </Typography>
                    </Popover>
                </div>
                <label className="tts_icon">
                    <input type="file" onChange={imageUploadHandler} multiple />
                    <span>
                        <AttachFile />
                    </span>
                </label>
                <form>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="write a message"
                    />
                    {input && (
                        <IconButton type="submit" onClick={sendMessage}>
                            <DoubleArrow />
                        </IconButton>
                    )}
                </form>
                <IconButton onClick={() => setIsListening((prevState) => !prevState)}>
                    <Mic style={color} />
                </IconButton>
            </div>

            <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Room Members</DialogTitle>
                <DialogContent>
                    <List>
                        {members.map((member) => (
                            <ListItem key={member.uid}>
                                <ListItemAvatar>
                                    <Avatar src={member.photoURL} />
                                </ListItemAvatar>
                                <ListItemText primary={member.displayName} />
                            </ListItem>
                        ))}
                    </List>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Search"
                        type="text"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <List>
                        {filteredUsers.map((user) => (
                            <ListItem key={user.uid} button onClick={() => handleUserToggle(user.uid)}>
                                <ListItemAvatar>
                                    <Avatar src={user.photoURL} />
                                </ListItemAvatar>
                                <ListItemText primary={user.displayName} />
                                <Checkbox
                                    edge="end"
                                    checked={selectedUsers.includes(user.uid)}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddMembers} color="primary">
                        Add
                    </Button>
                    <Button onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openLeaveDialog}
                onClose={() => setOpenLeaveDialog(false)}
                aria-labelledby="leave-room-dialog-title"
            >
                <DialogTitle id="leave-room-dialog-title">Leave Room</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to leave this room?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLeaveDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLeaveRoom} color="secondary">
                        Leave
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openSettingsDialog} onClose={handleSettingsDialogClose} aria-labelledby="settings-dialog-title">
                <DialogTitle id="settings-dialog-title">Setting Language for Voice Chat</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <InputLabel id="language-select-label">Language</InputLabel>
                        <Select
                            labelId="language-select-label"
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                        >
                            <MenuItem value="en-US">English</MenuItem>
                            <MenuItem value="vi-VN">Vietnamese</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSettingsDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Chat;
