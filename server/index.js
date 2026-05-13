const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5055;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error('CRITICAL ERROR: Neither MONGODB_URI nor MONGO_URI is defined!');
} else {
  mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => {
      console.error('❌ MongoDB Connection Error:');
      console.error(err.message);
    });
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/scholarships', require('./routes/scholarships'));
app.use('/api/countries', require('./routes/countries'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/services', require('./routes/services'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/heroslides', require('./routes/heroslides'));
app.use('/api/users', require('./routes/users'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/categories', require('./routes/categories'));

app.get('/', (req, res) => {
  res.send('Rizqara Global Education API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
