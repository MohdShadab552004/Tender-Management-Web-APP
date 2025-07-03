import db from '../config/db.js'; 

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
    const companyResult = await db('companies')
      .select('id')
      .where({ user_id: userId })
      .first();

    if (!companyResult) {
      return res.status(404).json({ message: 'No company found for this user.' });
    }

    const companyId = companyResult.id;

    await db('applications').insert({
      tender_id: tenderId,
      company_id: companyId,
      name,
      email,
      bid_amount: bidAmount,
      proposal: coverLetter
    });

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
    const result = await db('applications')
      .select('id', 'name', 'email', 'bid_amount', 'proposal', 'submitted_at')
      .where({ tender_id: tenderId });

    return res.status(200).json({
      applications: result,
    });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
