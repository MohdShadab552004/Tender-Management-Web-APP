import db from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await db('users').where({ email }).first();

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db('users')
      .insert({ email, password: hashedPassword })
      .returning(['id', 'email']);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token);

    return res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('❌ Error in registerController:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();

    if (!user) {
      return res.status(409).json({ message: 'User not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token);
    return res.status(200).json({ message: 'Login successful' });

  } catch (err) {
    console.error('❌ Error in loginController:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};
