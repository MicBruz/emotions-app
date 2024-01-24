// TODO: Use Express Router: Utilize Express's Router to create modular route handlers.

const express = require('express');
const app = express();
const categoriesRoutes = require('./routes/categories');
const emotionsRoutes = require('./routes/emotions');

app.use(express.json());

app.use('/categories', categoriesRoutes);
app.use('/emotions', emotionsRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
