const express = require('express');
const path = require('path');

const app = express();
const PORT = 8000;

// Serve static files from the 'client' directory
app.use(express.static(path.resolve(__dirname, '../client')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
