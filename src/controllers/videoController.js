const pool = require("../db/db");

exports.createVideo = async (req, res) => {
  try {
    const { title, description, video_url, category_id } = req.body;

    if (!title || !video_url) {
      return res.status(400).json({
        message: "Title and video URL are required",
      });
    }

    const trainerId = req.user.id;

    if (category_id) {
      const categoryResult = await pool.query(
        `SELECT * FROM video_categories
         WHERE id = $1 AND trainer_id = $2`,
        [category_id, trainerId]
      );

      if (categoryResult.rows.length === 0) {
        return res.status(404).json({
          message: "Category not found",
        });
      }
    }

    const result = await pool.query(
      `INSERT INTO videos
       (title, description, video_url, category_id, trainer_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, video_url, category_id, trainerId]
    );

    res.status(201).json({
      message: "Video created successfully",
      video: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


exports.assignVideoToClient = async (req, res) => {
  try {
    const { videoId, clientId } = req.params;
    const trainerId = req.user.id;

    const videoResult = await pool.query(
      "SELECT * FROM videos WHERE id = $1 AND trainer_id = $2",
      [videoId, trainerId]
    );

    if (videoResult.rows.length === 0) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    const clientResult = await pool.query(
      "SELECT * FROM clients WHERE id = $1 AND trainer_id = $2",
      [clientId, trainerId]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const result = await pool.query(
      `INSERT INTO client_videos (client_id, video_id)
       VALUES ($1, $2)
       RETURNING *`,
      [clientId, videoId]
    );

    res.status(201).json({
      message: "Video assigned to client successfully",
      assignment: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        message: "Video already assigned to this client",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};



exports.getClientVideos = async (req, res) => {
  try {
    const { clientId } = req.params;
    const trainerId = req.user.id;

    const clientResult = await pool.query(
      "SELECT * FROM clients WHERE id = $1 AND trainer_id = $2",
      [clientId, trainerId]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    const result = await pool.query(
      `SELECT videos.*
       FROM videos
       JOIN client_videos
       ON videos.id = client_videos.video_id
       WHERE client_videos.client_id = $1
       AND videos.trainer_id = $2`,
      [clientId, trainerId]
    );

    res.json({
      videos: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


exports.updateWatchedStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { watched } = req.body;

    if (typeof watched !== "boolean") {
      return res.status(400).json({
        message: "Watched must be true or false",
      });
    }

    const result = await pool.query(
      `UPDATE client_videos
       SET watched = $1,
           watched_at = CASE 
             WHEN $1 = true THEN CURRENT_TIMESTAMP
             ELSE NULL
           END
       WHERE id = $2
       RETURNING *`,
      [watched, assignmentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    res.json({
      message: "Watched status updated successfully",
      assignment: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};