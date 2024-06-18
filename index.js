const express = require('express');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRouter');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', articleRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});