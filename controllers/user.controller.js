const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const userController = {
  register: async (req, res) => {
    try {
      const { email } = req.body;
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const user = new User(req.body);
      await user.save();

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = userController;