import { useContext } from 'react';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { generateKeywords, AuthContext } from '../redux/auth-context';
import { ref, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../firebase'; // Đảm bảo import Realtime Database

export default function OAuth() {
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const user = resultsFromGoogle.user;

      // Kiểm tra email đã tồn tại trong Realtime Database
      const usersRef = ref(db, 'users');
      const emailQuery = query(usersRef, orderByChild('email'), equalTo(user.email));
      const querySnapshot = await get(emailQuery);

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();

      if (querySnapshot.exists()) {
        // Email đã tồn tại, không thêm người dùng
        console.log('Email đã tồn tại trong Realtime Database');
      } else {
        // Lưu người dùng vào Realtime Database
        set(ref(db, 'users/' + user.uid), {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          providerId: user.providerData[0].providerId,
          keywords: generateKeywords(user.displayName.toLowerCase()),
        });
      }

      // Lưu người dùng vào localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }));

      login(user);

      dispatch(signInSuccess(data));

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='w-6 h-6 mr-2' />
      Continue with Google
    </Button>
  );
}
