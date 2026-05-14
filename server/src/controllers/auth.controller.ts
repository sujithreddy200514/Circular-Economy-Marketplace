import { Request, Response } from 'express';
import { UserLoginInput, UserRegistrationInput, UserRole, CompanyType } from '../interfaces/user.interface';
import Joi from 'joi';
import { generateToken } from '../utils/jwt.utils';
import { createUser, findUserByEmail } from '../data/demoStore';

// Validation schema for user registration
const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  company_name: Joi.string().required(),
  role: Joi.string().valid('company', 'transporter', 'admin').required(),
  contact_person: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  postal_code: Joi.string().optional(),
  company_type: Joi.string().valid('manufacturer', 'recycler', 'processor', 'distributor').when('role', {
    is: 'company',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  industry_sector: Joi.string().optional()
});

// Validation schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { error } = registrationSchema.validate({
      email: req.body.email,
      password: req.body.password,
      company_name: req.body.companyName || req.body.company_name,
      role: req.body.role || 'company',
      company_type: req.body.company_type || 'manufacturer'
    }, { allowUnknown: true });

    if (error) {
      res.status(400).json({ success: false, message: error.details[0].message });
      return;
    }

    if (findUserByEmail(req.body.email)) {
      res.status(409).json({ success: false, message: 'Email is already registered' });
      return;
    }

    const createdUser = createUser({
      name: req.body.name || req.body.companyName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'company',
      companyName: req.body.companyName || req.body.company_name
    });

    const userData = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      companyName: createdUser.companyName,
      walletBalance: createdUser.walletBalance
    };
    
    // Generate token
    const token = generateToken({
      id: userData.id,
      email: userData.email,
      role: userData.role
    });
    
    // Return success response with token
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/**
 * Login user and return JWT token
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = findUserByEmail(email);

    if (!user || user.password !== password) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
}; 
