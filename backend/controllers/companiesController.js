import db from '../config/db.js';
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
    const existCompany = await db('companies').where({ user_id: userId }).first();

    if (existCompany) {
      return res.status(409).json({ message: 'Company already created' });
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${uuid()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('logo')
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

    const [newCompany] = await db('companies')
      .insert({
        user_id: userId,
        name,
        industry,
        description,
        logo_url,
      })
      .returning('*');

    return res.status(201).json({
      message: 'Company created successfully',
      company: newCompany,
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
    const result = await db('companies')
      .whereILike('name', `%${query}%`)
      .orWhereILike('industry', `%${query}%`)
      .orWhereILike('description', `%${query}%`);

    return res.status(200).json({ companies: result });
  } catch (err) {
    console.error('❌ Error searching companies:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};
