const express = require('express');
const app = express();
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  try {
    const { name, category_id, ...otherFields } = req.body;
    const newEmotion = await pool.query(
        "INSERT INTO emotions (name, category_id, behavioral_impact, physical_impact, regulation_strategies, interpersonal_impact, connected_thoughts, metaphors, situations) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [name, category_id, otherFields.behavioral_impact, otherFields.physical_impact, otherFields.regulation_strategies, otherFields.interpersonal_impact, otherFields.connected_thoughts, otherFields.metaphors, otherFields.situations]
    );
    res.json(newEmotion.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get('/', async (req, res) => {
  try {
    const allEmotions = await pool.query("SELECT * FROM emotions");
    res.json(allEmotions.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build SET part of the query dynamically
    const setCommands = [];
    const values = [];
    let queryIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      setCommands.push(`${key} = $${queryIndex}`);
      values.push(value);
      queryIndex++;
    }

    if (setCommands.length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    // Complete query
    const query = `UPDATE emotions SET ${setCommands.join(', ')} WHERE id = $${queryIndex} RETURNING *`;
    values.push(id);

    const updatedEmotion = await pool.query(query, values);

    if (updatedEmotion.rows.length === 0) {
      return res.status(404).json({ message: "Emotion not found" });
    }

    res.json(updatedEmotion.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteEmotion = await pool.query(
        "DELETE FROM emotions WHERE id = $1 RETURNING *",
        [id]
    );

    if (deleteEmotion.rows.length === 0) {
      return res.status(404).json({ message: "Emotion not found" });
    }

    res.json({ message: "Emotion was deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const emotion = await pool.query(
        "SELECT * FROM emotions WHERE id = $1",
        [id]
    );

    if (emotion.rows.length === 0) {
      return res.status(404).json({ message: "Emotion not found" });
    }

    res.json(emotion.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
