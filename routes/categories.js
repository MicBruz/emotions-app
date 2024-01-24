const express = require('express');
const router = express.Router();
const pool = require('../db');


router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await pool.query(
        "INSERT INTO categories (name) VALUES ($1) RETURNING *",
        [name]
    );
    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get('/', async (req, res) => {
  console.log("GET request to /categories");
  try {
    const allCategories = await pool.query("SELECT * FROM categories");
    res.json(allCategories.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await pool.query(
        "SELECT * FROM categories WHERE id = $1",
        [id]
    );

    if (category.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
