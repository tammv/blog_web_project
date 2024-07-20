import React, { useState, createContext, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, set, serverTimestamp } from 'firebase/database'; // Corrected import
import { db } from '../firebase';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {}
});

const AuthContextProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const loginHandler = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logoutHandler = () => {
    const auth = getAuth();
    signOut(auth);
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login: loginHandler, logout: logoutHandler }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

// Hàm thêm tài liệu vào Realtime Database
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = ref(db, `${collectionName}/${data.uid}`);
    await set(docRef, {
      ...data,
      createdAt: serverTimestamp()
    });
    console.log(`Document written with ID: ${data.uid}`);
  } catch (error) {
    console.error('Error adding document:', error);
  }
};

// Hàm tạo keywords từ displayName, sử dụng cho tìm kiếm
export const generateKeywords = (displayName) => {
  const name = displayName.split(' ').filter(word => word);
  const length = name.length;
  let flagArray = Array(length).fill(false);
  let result = [];
  let stringArray = [];

  const createKeywords = (name) => {
    const arrName = [];
    let curName = '';
    name.split('').forEach(letter => {
      curName += letter;
      arrName.push(curName);
    });
    return arrName;
  };

  const findPermutation = (k) => {
    for (let i = 0; i < length; i++) {
      if (!flagArray[i]) {
        flagArray[i] = true;
        result[k] = name[i];

        if (k === length - 1) {
          stringArray.push(result.join(' '));
        }

        findPermutation(k + 1);
        flagArray[i] = false;
      }
    }
  };

  findPermutation(0);

  const keywords = stringArray.reduce((acc, cur) => {
    const words = createKeywords(cur);
    return [...acc, ...words];
  }, []);

  return keywords;
};
