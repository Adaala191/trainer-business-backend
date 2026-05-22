const pool = require("../db/db");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const trainerId = req.user.id;

    const result = await pool.query(
      `INSERT INTO video_categories (name, trainer_id)
       VALUES ($1, $2)
       RETURNING *`,
      [name, trainerId]
    );

    res.status(201).json({
      message: "Category created successfully",
      category: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        message: "Category already exists for this trainer",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};