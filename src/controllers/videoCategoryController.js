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


exports.getCategories = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM video_categories
       WHERE trainer_id = $1
       ORDER BY created_at DESC`,
      [trainerId]
    );

    res.json({
      categories: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


exports.patchCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const trainerId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const result = await pool.query(
      `UPDATE video_categories
       SET name = $1
       WHERE id = $2 AND trainer_id = $3
       RETURNING *`,
      [name, categoryId, trainerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category updated successfully",
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


exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const trainerId = req.user.id;

    const categoryResult = await pool.query(
      `SELECT * FROM video_categories
       WHERE id = $1 AND trainer_id = $2`,
      [categoryId, trainerId]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await pool.query(
      `UPDATE videos
       SET category_id = NULL
       WHERE category_id = $1 AND trainer_id = $2`,
      [categoryId, trainerId]
    );

    const result = await pool.query(
      `DELETE FROM video_categories
       WHERE id = $1 AND trainer_id = $2
       RETURNING *`,
      [categoryId, trainerId]
    );

    res.json({
      message: "Category deleted successfully. Videos moved to Uncategorized.",
      category: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};