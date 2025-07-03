import db from '../config/db.js';

export const createTenderController = async (req, res) => {
  const { title, description, deadline, budget } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized. Token missing or invalid.' });
  if (!title || !description || !deadline || !budget)
    return res.status(400).json({ message: 'All fields are required.' });

  try {
    const company = await db('companies').where({ user_id: userId }).first();

    if (!company) return res.status(404).json({ message: 'No company found for this user.' });

    const [tender] = await db('tenders')
      .insert({
        company_id: company.id,
        title,
        description,
        deadline,
        budget,
      })
      .returning('*');

    return res.status(201).json({
      message: 'Tender created successfully.',
      tender,
    });
  } catch (err) {
    console.error('❌ Error creating tender:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const listTenderController = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized. Token missing or invalid.' });

  try {
    const tenders = await db('tenders')
      .join('companies', 'tenders.company_id', 'companies.id')
      .select(
        'tenders.*',
        'companies.name as companyName',
        'companies.logo_url as companyLogoUrl'
      );

    if (!tenders.length) {
      return res.status(404).json({ message: 'No tenders available.' });
    }

    return res.status(200).json({ tenders });
  } catch (err) {
    console.error('❌ Error fetching tenders:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};



export const listCompanyTendersController = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized. Token missing or invalid.' });

  try {
    const company = await db('companies').where({ user_id: userId }).first();

    if (!company) {
      return res.status(404).json({ message: 'Company not found for this user.' });
    }

    const tenders = await db('tenders')
      .select('id', 'title', 'description', 'deadline', 'budget')
      .where({ company_id: company.id })
      .orderBy('created_at', 'desc');

    if (!tenders.length) {
      return res.status(404).json({ message: 'No tenders found for this company.' });
    }

    return res.status(200).json({ tenders });
  } catch (err) {
    console.error('❌ Error fetching company tenders:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};



export const listTenderIdController = async (req, res) => {
  const userId = req.user?.id;
  const { tenderId } = req.params;

  if (!userId) return res.status(401).json({ message: 'Unauthorized. Token missing or invalid.' });

  try {
    const tender = await db('tenders as t')
      .join('companies as c', 't.company_id', 'c.id')
      .select(
        't.id',
        't.title',
        't.description',
        't.deadline',
        't.budget',
        'c.name as companyname',
        'c.logo_url as companylogourl'
      )
      .where('t.id', tenderId)
      .first();

    if (!tender) {
      return res.status(404).json({ message: 'Tender not found' });
    }

    return res.status(200).json({ tender });
  } catch (err) {
    console.error('❌ Error fetching tender by ID:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const deleteTenderController = async (req, res) => {
  const { tenderId } = req.params;

  if (!tenderId) return res.status(400).json({ error: 'Tender ID is required.' });

  try {
    const [deletedTender] = await db('tenders')
      .where({ id: tenderId })
      .del()
      .returning('*');

    if (!deletedTender) {
      return res.status(404).json({ error: 'Tender not found.' });
    }

    return res.status(200).json({
      message: 'Tender deleted successfully.',
      deletedTender,
    });
  } catch (error) {
    console.error('❌ Error deleting tender:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

