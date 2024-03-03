const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json()); // Parse JSON requests

// Initialize Firebase Admin SDK
const serviceAccount = require('./ecohub-2a3f4-firebase-adminsdk-kz1ma-8f25a4bc5a.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Add any additional Firebase config options here
});

const firestore = admin.firestore();

// Route for handling waste collection requests
app.post('/api/waste-collection', async (req, res) => {
  try {
    const { user, wasteDetails } = req.body;

    // Store waste collection request in Firestore
    const collectionRef = firestore.collection('wasteCollectionRequests');
    await collectionRef.add({
      userId: user.uid,
      wasteDetails,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: 'Waste collection request received.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
