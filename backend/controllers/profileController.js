import { pool } from '../config/db.js';

export const myProfileController = async (req, res) => {
  const userId = req.user?.id; // Middleware must set `req.user`

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log("controller me entri")
  try {
    const userResult = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [userId]
    );

    const user = userResult.rows[0];
console.log(user,1)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 2. Get company details
    const companyResult = await pool.query(
      `SELECT id, name, industry, description, logo_url FROM companies WHERE user_id = $1`,
      [userId]
    );

    const company = companyResult.rows[0];
console.log(company,2)
    // 3. Count tenders posted by this company
    const tendersPostedResult = await pool.query(
      `SELECT COUNT(*) FROM tenders WHERE company_id = $1`,
      [company?.id]
    );
console.log(company,3)
    const applicationsSentResult = await pool.query(
      `SELECT COUNT(*) FROM applications WHERE company_id = $1`,
      [company?.id]
    );

     const bidResult = await pool.query(
      `SELECT COALESCE(SUM(bid_amount), 0) AS total_bidding 
       FROM applications 
       WHERE company_id = $1`,
      [company?.id]
    );

    const totalBidding = parseFloat(bidResult.rows[0].total_bidding || 0);

    const profileData = {
      name: user.name,
      email: user.email,
      joined: user.created_at.toISOString().split('T')[0],
      company: {
        name: company?.name || '',
        industry: company?.industry || '',
        description: company?.description || '',
        logo_url: company?.logo_url || '',
        tendersPosted: parseInt(tendersPostedResult.rows[0].count || 0),
        applicationsSent: parseInt(applicationsSentResult.rows[0].count || 0)
      },
      totalBidding
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error('Error in myProfileController:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



export const updateProfileController = async (req, res) => {
    console.log("first")
  try {
    const userId = req.user.id;
    const { email, company } = req.body;

    if ( !email || !company?.name || !company?.industry || !company?.description) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Update user table
    await pool.query(
      `UPDATE users 
       SET  email = $1 
       WHERE id = $2`,
      [email, userId]
    );

    // Update company table
    await pool.query(
      `UPDATE companies 
       SET name = $1, industry = $2, description = $3 
       WHERE user_id = $4`,
      [company.name, company.industry, company.description, userId]
    );

   


    // Fetch updated profile
    const result = await pool.query(
      `SELECT 
         u.email, u.created_at AS joined,
         c.name AS company_name, c.industry, c.description, c.logo_url
       FROM users u
       LEFT JOIN companies c ON u.id = c.user_id
       WHERE u.id = $1`,
      [userId]
    );

    const row = result.rows[0];



    res.status(200).json({
      email: row.email,
      joined: row.joined,
      company: {
        name: row.company_name,
        industry: row.industry,
        description: row.description,
        logo_url: row.logo_url,
        
      },
    });

  } catch (error) {
    console.error('❌ Error in updateProfileController:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
