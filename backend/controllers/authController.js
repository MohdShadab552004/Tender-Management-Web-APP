import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existResult.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    const newUser = insertResult.rows[0];

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.cookie('token',token);
    return res.status(201).json({ message: 'User registered successfully'});
  } catch (err) {
    console.error('Error in registerController:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};



export const loginController = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const existResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existResult.rows.length === 0) {
            return res.status(409).json({ message: 'User not exist' });
        }
        const user = existResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('token',token)
        return res.status(200).json({ message: 'Login successful'});
    } catch (err) {
        console.error('❌ Error in loginController:', err.message);
        return res.status(500).json({ message: 'Server error' });
    }
}