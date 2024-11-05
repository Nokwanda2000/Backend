const express = require('express');
const { db } = require('./firebase');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to check JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send('A token is required for authentication');
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Invalid Token');
    req.user = decoded;
    next();
  });
};

// Sample route to create a document
router.post('/items', verifyToken, async (req, res) => {
  try {
    const newItem = req.body;
    const docRef = await db.collection('items').add(newItem);
    res.status(201).send({ id: docRef.id, ...newItem });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to authenticate user and return a JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Here, you would typically validate user credentials
  // For simplicity, we're just returning a token

  const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

module.exports = router;
