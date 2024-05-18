const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { authRoutes } = require('./routes/authRoutes');
const { collectionRoutes } = require('./routes/collectionRoutes');
const { propRoutes } = require('./routes/propRoutes');
const { entryRoutes } = require('./routes/entryRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
});

app.use('/', authRoutes);
app.use('/', collectionRoutes);
app.use('/', propRoutes);
app.use('/', entryRoutes);
