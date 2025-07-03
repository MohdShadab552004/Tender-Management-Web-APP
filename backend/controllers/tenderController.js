import { pool } from '../config/db.js';

export const createTenderController = async (req, res) => {
    const { title, description, deadline, budget } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized. Token missing or invalid.' });
    }

    if (!title || !description || !deadline || !budget) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // ✅ Get company info linked to this user
        const companyResult = await pool.query(
            'SELECT * FROM companies WHERE user_id = $1',
            [userId]
        );

        if (companyResult.rowCount === 0) {
            return res.status(404).json({ message: 'No company found for this user.' });
        }

        const companyId = companyResult.rows[0].id;
        const companyName = companyResult.rows[0].name;

        // ✅ Insert new tender
        const tenderResult = await pool.query(
            `INSERT INTO tenders (company_id, title, description, deadline, budget)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [companyId, title, description, deadline, budget]
        );

        return res.status(201).json({
            message: 'Tender created successfully.',
            tender: tenderResult.rows[0],
        });
    } catch (err) {
        console.error('❌ Error creating tender:', err.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const listTenderController = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. Token missing or invalid.' });
  }

  try {
    const query = `
      SELECT 
        tenders.*,
        companies.name AS companyName,
        companies.logo_url AS companyLogoUrl
      FROM 
        tenders
      INNER JOIN 
        companies
      ON 
        tenders.company_id = companies.id
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No tenders available.' });
    }

    return res.status(200).json({ tenders: result.rows });
  } catch (err) {
    console.error('❌ Error fetching tenders:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const listCompanyTendersController = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. Token missing or invalid.' });
  }

  try {
    // First, get the company_id of the logged-in user
    const companyResult = await pool.query(
      'SELECT id FROM companies WHERE user_id = $1',
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ message: 'Company not found for this user.' });
    }

    const companyId = companyResult.rows[0].id;

    // Now fetch all tenders for that company
    const tenderResult = await pool.query(
      `SELECT id, title, description, deadline, budget 
       FROM tenders 
       WHERE company_id = $1
       ORDER BY created_at DESC`,
      [companyId]
    );

    if (tenderResult.rows.length === 0) {
      return res.status(404).json({ message: 'No tenders found for this company.' });
    }

    return res.status(200).json({ tenders: tenderResult.rows });
  } catch (err) {
    console.error('❌ Error fetching company tenders:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const listTenderIdController = async (req, res) => {
  const userId = req.user?.id;
  const { tenderId } = req.params;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. Token missing or invalid.' });
  }

  try {
    const tenderResult = await pool.query(
      `SELECT 
         t.id, t.title, t.description, t.deadline, t.budget, 
         c.name AS companyname, c.logo_url AS companylogourl
       FROM tenders t
       JOIN companies c ON t.company_id = c.id
       WHERE t.id = $1`,
      [tenderId]
    );

    if (tenderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    return res.status(200).json({ tender: tenderResult.rows[0] });
  } catch (err) {
    console.error('❌ Error fetching tender by ID:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTenderController = async (req, res) => {
  const { tenderId } = req.params;

  if (!tenderId) {
    return res.status(400).json({ error: 'Tender ID is required.' });
  }

  try {
    const result = await pool.query(
      `DELETE FROM tenders WHERE id = $1 RETURNING *`,
      [tenderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tender not found.' });
    }

    return res.status(200).json({
      message: 'Tender deleted successfully.',
      deletedTender: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Error deleting tender:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
