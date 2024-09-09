const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const sequelize = require('./config/config');
const errorHandler = require('./utils/errorHandler');
const apiRoutes = require('./routes/index'); 

require('dotenv').config();

const PORT = process.env.PORT;

const app = express();

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(bodyParser.json());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({ message: 'Invalid JSON format' });
    }
    next();
  });

// Gunakan route utama untuk semua API di bawah "/api"
app.use('/api', apiRoutes);

// Global error handler middleware
app.use(errorHandler);

// Sync Database
sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
