const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authorizationRoutes = require('./routes/Authorization');
const groupChatRoutes = require('./routes/GroupChat');

const app = express();
const PORT = process.env.PORT || 3000;

const DB_CONNECTION_STRING = process.env.DB_URI || 'mongodb://admin:admin@mongo:27017/admin';

mongoose.connect(DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/auth', authorizationRoutes);
app.use('/api/group-chat', groupChatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});