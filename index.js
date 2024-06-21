const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRouter');
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});