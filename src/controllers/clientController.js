const pool = require("../db/db");

exports.createClient = async (req, res) => {
  try {
    // 1. Get data from body
    const { name, email, phone, age, weight, country } = req.body;

    // 2. Validate required fields
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // 3. Get trainer ID from token
    const trainerId = req.user.id;

    // 4. Insert into database
    const result = await pool.query(
      `INSERT INTO clients 
      (name, email, phone, age, weight, country, trainer_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [name, email, phone, age, weight, country, trainerId]
    );

    // 5. Send response
    res.status(201).json({
      message: "Client created successfully",
      client: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getClients = async (req, res) => {
  try {
    // 1. Get trainer ID from token
    const trainerId = req.user.id;

    // 2. Fetch only this trainer's clients
    const result = await pool.query(
      "SELECT * FROM clients WHERE trainer_id = $1",
      [trainerId]
    );

    // 3. Send response
    res.json({
      clients: result.rows,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};