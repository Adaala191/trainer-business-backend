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

  }  catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        message: "Client already exists for this trainer",
      });
    }

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

exports.getClientById = async (req, res) => {
  try {
    const clientId = req.params.id;
    const trainerId = req.user.id;

    const result = await pool.query(
      "SELECT * FROM clients WHERE id = $1 AND trainer_id = $2",
      [clientId, trainerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({
      client: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const trainerId = req.user.id;

    const { name, email, phone, age, weight, country } = req.body;

    const result = await pool.query(
      `UPDATE clients
       SET name = $1,
           email = $2,
           phone = $3,
           age = $4,
           weight = $5,
           country = $6
       WHERE id = $7 AND trainer_id = $8
       RETURNING *`,
      [name, email, phone, age, weight, country, clientId, trainerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({
      message: "Client updated successfully",
      client: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        message: "Client already exists for this trainer",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};


exports.patchClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const trainerId = req.user.id;

    const { name, email, phone, age, weight, country } = req.body;

    // Build dynamic query
    const fields = [];
    const values = [];
    let index = 1;

    if (name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }

    if (email !== undefined) {
      fields.push(`email = $${index++}`);
      values.push(email);
    }

    if (phone !== undefined) {
      fields.push(`phone = $${index++}`);
      values.push(phone);
    }

    if (age !== undefined) {
      fields.push(`age = $${index++}`);
      values.push(age);
    }

    if (weight !== undefined) {
      fields.push(`weight = $${index++}`);
      values.push(weight);
    }

    if (country !== undefined) {
      fields.push(`country = $${index++}`);
      values.push(country);
    }

    // If no fields provided
    if (fields.length === 0) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    const query = `
      UPDATE clients
      SET ${fields.join(", ")}
      WHERE id = $${index++} AND trainer_id = $${index}
      RETURNING *
    `;

    values.push(clientId, trainerId);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({
      message: "Client updated successfully",
      client: result.rows[0],
    });

  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(400).json({
        message: "Client already exists for this trainer",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const trainerId = req.user.id;

    const result = await pool.query(
      "DELETE FROM clients WHERE id = $1 AND trainer_id = $2 RETURNING *",
      [clientId, trainerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({
      message: "Client deleted successfully",
      client: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};