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

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Token missing or invalid.'
    });
  }

  // Extract query params
  const {
    search,
    companyId,
    page = 1,
    limit = 10
  } = req.query;

  const pageNumber = Math.max(1, parseInt(page));
  const limitNumber = Math.min(6, Math.max(1, parseInt(limit)));
  const offset = (pageNumber - 1) * limitNumber;

  try {
    // 📦 Base query
    let query = db('tenders')
      .join('companies', 'tenders.company_id', 'companies.id')
      .select(
        'tenders.id',
        'tenders.title',
        'tenders.description',
        'tenders.deadline',
        'tenders.budget',
        'companies.name as companyname',
        'companies.logo_url as companylogourl',
        db.raw('tenders.created_at as published_date')
      )
      .orderBy('tenders.created_at', 'desc');

    // 🔍 Optional search
    if (search) {
      query = query.where((builder) =>
        builder
          .whereILike('tenders.title', `%${search}%`)
          .orWhereILike('tenders.description', `%${search}%`)
          .orWhereILike('companies.name', `%${search}%`) // 🔥 Added this line
          .orWhereILike('companies.field', `%${search}%`) // 🔥 Added this line
      );
    }


    // 🏢 Optional company filter
    if (companyId) {
      query = query.where('companies.id', companyId);
    }

    const tenders = await query.limit(limitNumber).offset(offset);

    // 📊 Total count
    let countQuery = db('tenders')
      .join('companies', 'tenders.company_id', 'companies.id');

    if (search) {
      countQuery = countQuery.where(builder =>
        builder
          .whereILike('tenders.title', `%${search}%`)
          .orWhereILike('tenders.description', `%${search}%`)
      );
    }

    if (companyId) {
      countQuery = countQuery.where('companies.id', companyId);
    }

    const totalResult = await countQuery.count('* as count').first();
    const totalCount = parseInt(totalResult?.count) || 0;
    const totalPages = Math.ceil(totalCount / limitNumber);

    return res.status(200).json({
      success: true,
      tenders,
      total: totalCount,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1
    });

  } catch (err) {
    console.error('❌ Error fetching tenders:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching tenders',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};




export const listCompanyTendersController = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized. Token missing or invalid.' });
  }

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

    // Get application counts for all tenders in one query
    const applicationCounts = await db('applications')
      .select('tender_id')
      .count('* as count')
      .whereIn('tender_id', tenders.map(t => t.id))
      .groupBy('tender_id');

    // Map tender_id to count for quick lookup
    const countMap = {};
    applicationCounts.forEach(({ tender_id, count }) => {
      countMap[tender_id] = parseInt(count, 10);
    });

    // Attach applicationCount to each tender
    const enrichedTenders = tenders.map(t => ({
      ...t,
      applicationCount: countMap[t.id] || 0
    }));

    return res.status(200).json({ tenders: enrichedTenders });
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


export const updateTenderController = async (req, res) => {
  try {
    const { title, description, deadline, budget } = req.body;
    const { tenderId } = req.params;
    console.log("CALLING AND HITTING")
    // Update tender
    const updatedTender = await db('tenders')
      .where({ id: Number(tenderId) })
      .update({
        title,
        description,
        deadline,
        budget
      })
      .returning('*');

    console.log(updatedTender)
    if (updatedTender.length === 0) {
      return res.status(404).json({ message: 'Tender not found' });
    }
    console.log(updatedTender[0])
    res.status(200).json(updatedTender[0]);
  } catch (error) {
    console.error('Error updating tender:', error);
    res.status(500).json({ message: 'Internal server error' });
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

