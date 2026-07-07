const pool = require("../db/db");

exports.createContactInfo = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const {
      whatsapp,
      phone,
      instagram,
      facebook,
      website,
    } = req.body;

    const existing = await pool.query(
      `SELECT * FROM trainer_contact_info
       WHERE trainer_id = $1`,
      [trainerId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message:
          "Contact information already exists. Use PATCH instead.",
      });
    }

    const result = await pool.query(
      `INSERT INTO trainer_contact_info
       (trainer_id, whatsapp, phone, instagram, facebook, website)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        trainerId,
        whatsapp,
        phone,
        instagram,
        facebook,
        website,
      ]
    );

    res.status(201).json({
      message: "Contact information created successfully",
      contact: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


exports.getContactInfo = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM trainer_contact_info
       WHERE trainer_id = $1`,
      [trainerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Contact information not found",
      });
    }

    res.json({
      contact: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


exports.patchContactInfo = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const {
      whatsapp,
      phone,
      instagram,
      facebook,
      website,
    } = req.body;

    const existing = await pool.query(
      `SELECT * FROM trainer_contact_info
       WHERE trainer_id = $1`,
      [trainerId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        message: "Contact information not found",
      });
    }

    const fields = [];
    const values = [];
    let index = 1;

    if (whatsapp !== undefined) {
      fields.push(`whatsapp = $${index++}`);
      values.push(whatsapp);
    }

    if (phone !== undefined) {
      fields.push(`phone = $${index++}`);
      values.push(phone);
    }

    if (instagram !== undefined) {
      fields.push(`instagram = $${index++}`);
      values.push(instagram);
    }

    if (facebook !== undefined) {
      fields.push(`facebook = $${index++}`);
      values.push(facebook);
    }

    if (website !== undefined) {
      fields.push(`website = $${index++}`);
      values.push(website);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        message: "No data provided to update",
      });
    }

    const query = `
      UPDATE trainer_contact_info
      SET ${fields.join(", ")}
      WHERE trainer_id = $${index}
      RETURNING *
    `;

    values.push(trainerId);

    const result = await pool.query(query, values);

    res.json({
      message: "Contact information updated successfully",
      contact: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};