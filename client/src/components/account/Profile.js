import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { getAuth, signOut } from 'firebase/auth';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: '', email: '', photoURL: '' });

    useEffect(() => {
        async function fetchUserData() {
            try {
                const idToken = await getAuth().currentUser.getIdToken();
                const response = await fetch('http://localhost:4000/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setUserData({ name: data.name, email: data.email, photoURL: data.photoURL });
                } else {
                    toast.error(data.error);
                    navigate('/login');
                }
            } catch (error) {
                toast.error(error.message);
                navigate('/login');
            }
        };

        fetchUserData();
    }, [navigate]);

    async function handleLogout() {
        try {
            const auth = getAuth();
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div>
            <h1>User Profile</h1>
            {userData.photoURL && <img src={userData.photoURL} alt="Profile" />}
            <p>{userData.name}</p>
            <p>{userData.email}</p>
            <button onClick={handleLogout}>Logout</button>
            <ToastContainer />
        </div>
    );
};

export default Profile;