import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { getAuth, signOut } from 'firebase/auth';
import 'react-toastify/dist/ReactToastify.css';
import Home from "../../img/home.svg";
import Logout from "../../img/logout.svg";
import favoriteIcon from "../../img/favorite_empty.svg";
import ButtonWithIcon from '../default/ButtonWithIcon';
import './profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ name: '', email: '', photoURL: '' });
    const [loading, setLoading] = useState(true);

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
                toast.error(`Failed to fetch user data: ${error.message}`);
                navigate('/login');
            } finally {
                setLoading(false);
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
            toast.error(`Failed to log out: ${error.message}`);
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='profile-body'>
            <div className='profile-header'>
                <button className='profile-button'><img src={Home} alt="Home" /></button>
                <button className='profile-button' onClick={handleLogout}><img src={Logout} alt="Logout" /></button>
            </div>
            <div className='profile-card'>
                <div>
                    {userData.photoURL && (
                        <img
                            src={userData.photoURL}
                            className="profile-image"
                            alt="Profile"
                        />
                    )}
                </div>
                <div className='profile-info'>
                    <p className='profile-name'>{userData.name}</p>
                    <p className='profile-email'>{userData.email}</p>
                </div>
                <div className='profile-footer'>
                    <ButtonWithIcon
                        name="Wishlist"
                        imageSrc={favoriteIcon}
                    />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Profile;