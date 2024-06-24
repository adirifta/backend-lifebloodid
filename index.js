const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRouter');
const locationRoutes = require('./routes/locationsRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use('/api/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/api', authRoutes);
app.use('/api', articleRoutes);
app.use('/api', locationRoutes);
app.use('/api', registrationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});