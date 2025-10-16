import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log("Register Body:", JSON.stringify(req.body, null, 2));
    console.log("Environment:", {
      JWT_SECRET: !!process.env.JWT_SECRET,
      MONGODB_URI: !!process.env.MONGODB_URI
    });

    const { email, password, name } = req.body;
    console.log("Extracted fields:", { email, password: password ? '***' : undefined, name });

    // Validate input
    if (!email || !password || !name) {
      console.error('Missing required fields:', { email, password, name });
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,  // The password will be hashed by the User model's pre-save hook
      role: 'bidder'  // Set default role
    });

    await user.save();
    console.log('User created successfully:', user._id);

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    console.error('Error details:', error instanceof Error ? error.stack : 'Unknown error');
    return res.status(500).json({ message: 'Registration failed' });
  }
};

// Temporary route to check if email exists - REMOVE IN PRODUCTION
export const checkEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ exists: false, message: 'Email not found' });
    }
    
    return res.json({ exists: true, message: 'Email found', user: { id: user._id, email: user.email } });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to check email' });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log('Login request:', req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.error('Missing required fields:', { email, password });
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    console.log('Looking for user with email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    console.log('Comparing password for user:', email);
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    console.log('Creating JWT token for user:', email);
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', email);
    return res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error: unknown) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.stack);
      console.error('Error message:', error.message);
    }
    return res.status(500).json({ 
      error: 'Login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return res.json({
      user: {
        id: req.user._id,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({ error: 'Failed to get user' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Failed to delete user' });
  }
};

console.log('API_URL:', process.env.REACT_APP_API_URL);
