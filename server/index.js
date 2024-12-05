import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase/app';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

initializeApp(firebaseConfig);

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID
});

app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
    const { idToken } = req.body;
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const user = decodedToken;
        res.status(200).json({ name: user.name, email: user.email, photoURL: user.picture });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/profile', async (req, res) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const user = decodedToken;
        console.info("index.js | FTH.RL.51 | ", JSON.stringify(user));
        res.status(200).json({ name: user.name, email: user.email, photoURL: user.picture });
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});