const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');

router.post('/', (req, res) => {
  console.log("Incoming upload request...");
  
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error("Upload Error:", err);
      return res.status(500).json({ 
        message: 'Internal Server Error during upload', 
        error: err.message 
      });
    }

    if (!req.file) {
      console.warn("No file received in request");
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log("Upload successful:", req.file.path);
    res.json({
      url: req.file.path,
      public_id: req.file.filename
    });
  });
});

router.post('/multiple', upload.array('files', 10), (req, res) => {
  if (req.files) {
    const urls = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));
    res.json(urls);
  } else {
    res.status(400).json({ message: 'Files upload failed' });
  }
});

module.exports = router;
