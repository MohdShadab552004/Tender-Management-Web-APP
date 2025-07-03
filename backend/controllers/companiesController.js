import { pool } from '../config/db.js';
import supabase from '../config/supabase.js'; 
import { v4 as uuid } from 'uuid';

export const createCompaniesController = async (req, res) => {
  const { name, industry, description } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. Token missing or invalid.' });
  }

  if (!name || !industry || !description) {
    return res.status(400).json({ message: 'Name, industry, and description are required.' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Logo file is required.' });
  }

  try {
    const existCompany = await pool.query(
      `SELECT * FROM companies WHERE user_id = $1`,
      [userId]
    );

    if (existCompany.rows.length) {
      return res.status(409).json({ message: 'Company already created' });
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${uuid()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('logo') // your Supabase bucket
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError.message);
      return res.status(500).json({ message: 'Failed to upload logo' });
    }

    const { data: publicUrlData } = supabase.storage
      .from('logo')
      .getPublicUrl(fileName);

    const logo_url = publicUrlData?.publicUrl;

    // 👇 Step 4: Insert into database
    const result = await pool.query(
      `INSERT INTO companies (user_id, name, industry, description, logo_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, name, industry, description, logo_url]
    );

    return res.status(201).json({
      message: 'Company created successfully',
      company: result.rows[0],
    });
  } catch (err) {
    console.error('❌ Error creating company:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const searchCompaniesController = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM companies
       WHERE LOWER(name) ILIKE LOWER($1)
          OR LOWER(industry) ILIKE LOWER($1)
          OR LOWER(description) ILIKE LOWER($1)`,
      [`%${query}%`]
    );

    return res.status(200).json({ companies: result.rows });
  } catch (err) {
    console.error('❌ Error searching companies:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

