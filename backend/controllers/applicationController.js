import { pool } from '../config/db.js';

export const submitProposalsController = async (req, res) => {
  const { tenderId, name, email, bidAmount, coverLetter } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  }

  if (!tenderId || !name || !email || !bidAmount || !coverLetter) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const companyResult = await pool.query(
      'SELECT id FROM companies WHERE user_id = $1',
      [userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ message: 'No company found for this user.' });
    }

    const companyId = companyResult.rows[0].id;

    await pool.query(
      `INSERT INTO applications 
        (tender_id, company_id, name, email, bid_amount, proposal) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [tenderId, companyId, name, email, bidAmount, coverLetter]
    );

    return res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (err) {
    console.error('❌ Error submitting application:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getProposalsController = async (req, res) => {
  const tenderId = req.params.tenderId;

  if (!tenderId) {
    return res.status(400).json({ error: 'Tender ID is required' });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, email, bid_amount, proposal, submitted_at 
       FROM applications 
       WHERE tender_id = $1`,
      [tenderId]
    );

    return res.status(200).json({
      applications: result.rows,
    });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
