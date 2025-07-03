import db from '../config/db.js';

export const myProfileController = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await db('users')
      .select('id', 'email', 'created_at')
      .where({ id: userId })
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const company = await db('companies')
      .select('id', 'name', 'industry', 'description', 'logo_url')
      .where({ user_id: userId })
      .first();

    const companyId = company?.id;

    const tendersPostedResult = await db('tenders')
      .count('*')
      .where({ company_id: companyId })
      .first();

    const applicationsSentResult = await db('applications')
      .count('*')
      .where({ company_id: companyId })
      .first();

    const bidResult = await db('applications')
      .sum('bid_amount as total_bidding')
      .where({ company_id: companyId })
      .first();

    const profileData = {
      name: user.name,
      email: user.email,
      joined: user.created_at.toISOString().split('T')[0],
      company: {
        name: company?.name || '',
        industry: company?.industry || '',
        description: company?.description || '',
        logo_url: company?.logo_url || '',
        tendersPosted: parseInt(tendersPostedResult.count || 0),
        applicationsSent: parseInt(applicationsSentResult.count || 0)
      },
      totalBidding: parseFloat(bidResult.total_bidding || 0)
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error('Error in myProfileController:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


export const updateProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, company } = req.body;

    if (!email || !company?.name || !company?.industry || !company?.description) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    await db('users')
      .where({ id: userId })
      .update({ email });

    await db('companies')
      .where({ user_id: userId })
      .update({
        name: company.name,
        industry: company.industry,
        description: company.description
      });

    const companyData = await db('companies')
      .select('id', 'logo_url')
      .where({ user_id: userId })
      .first();

    const companyId = companyData?.id;

    const tendersPostedResult = await db('tenders')
      .count('*')
      .where({ company_id: companyId })
      .first();

    const applicationsSentResult = await db('applications')
      .count('*')
      .where({ company_id: companyId })
      .first();

    const bidResult = await db('applications')
      .sum('bid_amount as total_bidding')
      .where({ company_id: companyId })
      .first();

    const updatedUser = await db('users as u')
      .leftJoin('companies as c', 'u.id', 'c.user_id')
      .select(
        'u.email',
        'u.created_at',
        'c.name as company_name',
        'c.industry',
        'c.description',
        'c.logo_url'
      )
      .where('u.id', userId)
      .first();

    res.status(200).json({
      name: updatedUser.name,
      email: updatedUser.email,
      joined: updatedUser.created_at.toISOString().split('T')[0],
      company: {
        name: updatedUser.company_name,
        industry: updatedUser.industry,
        description: updatedUser.description,
        logo_url: updatedUser.logo_url,
        tendersPosted: parseInt(tendersPostedResult.count || 0),
        applicationsSent: parseInt(applicationsSentResult.count || 0)
      },
      totalBidding: parseFloat(bidResult.total_bidding || 0)
    });
  } catch (error) {
    console.error('❌ Error in updateProfileController:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
