// Import routes from the routes/index.js file
import routes from './routes/index';

const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Mount the routes from routes/index.js
app.use('/', routes);

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
