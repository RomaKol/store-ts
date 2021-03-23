import React, { createContext, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateUserData } from 'services/FirebaseService';
import { saveUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from 'services/LocalstorageService';
import { User } from 'dto/user';


interface AuthContextProps {
  isLoggedIn: boolean;
  userData: User | null;
  signUp(email: string, password: string, name: string): void;
  login(email: string, password: string): void;
  logout(): void;
  updateUser(uid: string, name: string, email: string): void;
};

interface AuthProviderProps {
  children: any,
};

const AuthContext = createContext({} as AuthContextProps);

const AuthProvider = (props: AuthProviderProps) => {
  const { children } = props;
  const [isLoggedIn, setLogged] = useState<boolean>(false);
  const [userData, setUserData] = useState<User | null>(null);

  const Provider = AuthContext.Provider;

  getUserFromLocalStorage().then(user => {
    if (user && user.uid && !isLoggedIn) {
      setLogged(true);
      setUserData({ ...user });
    }
  });

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await createUserWithEmailAndPassword(email, password, name).then((user: any) => {
        if (user.uid) {
          setLogged(true);
          setUserData(user);
          saveUserToLocalStorage(user);
        }
      });
    }
    catch (error) {
      console.log('Error Signing up with email and password', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(email, password).then((user: any) => {
        if (user.uid) {
          setLogged(true);
          setUserData(user);
          saveUserToLocalStorage(user);
        }
      });
    } catch (error) {
      console.log('Error signing in with password and email', error);
    }
  };

  const logout = () => {
    removeUserFromLocalStorage();
    setLogged(false);
    setUserData(null);
  };

  const updateUser = (uid: string, name: string, email: string) => {
    updateUserData(uid, name, email).then((user: any) => {
      saveUserToLocalStorage(user);
      setUserData(user);
    });
  }
  const contextProps = { isLoggedIn, userData, signUp, login, logout, updateUser };

  return <Provider value={contextProps}>{children}</Provider>
};

export { AuthContext, AuthProvider };