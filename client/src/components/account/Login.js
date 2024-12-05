import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./account.css";
import ButtonWithIcon from '../default/ButtonWithIcon';
import googleIcon from "../../img/googleicon.png";
import blockchainIcon from "../../img/blockchainicon.png";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

initializeApp(firebaseConfig);

const Login = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/profile', { state: { email: user.email, photoURL: user.photoURL } });
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    async function signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const idToken = await user.getIdToken();
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idToken })
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/profile', { state: { email: data.email, photoURL: data.photoURL } });
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "99vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", height: "50vh" }}>
                <div>
                    <img src={blockchainIcon} width="256px" alt="Blockchain icon" />
                </div>
                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <div><h1 style={{ textAlign: "center", color: "#F7F7F7" }}>Crypto </h1></div>
                    <div className="title-box"><h1 style={{ textAlign: "center", color: "#090909" }}>Scope</h1></div>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <ButtonWithIcon
                        onClick={signInWithGoogle}
                        name="Sign in with Google"
                        imageSrc={googleIcon}
                    />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;