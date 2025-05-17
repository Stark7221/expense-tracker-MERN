const User = require('../models/User');
const jwt = require('jsonwebtoken');

//generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

//register user
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please fill all the fields',
        });
    }

    try {
        //validation existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });  
            }
        //create user
            const user = await User.create({
                fullName,
                email,
                password,
                profileImageUrl,
            });
            if (user) {
                return res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    user: {
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        profileImageUrl: user.profileImageUrl,
                        token: generateToken(user._id),
                    },
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user data',
                });
            }
         }
        catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
}

//Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    // Giriş verileri eksikse
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
  
    try {
      const user = await User.findOne({ email });
  
      // Kullanıcı bulunamadıysa
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
  
      const isMatch = await user.comparePassword(password);
  
      // Şifre uyuşmadıysa
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
  
      // Giriş başarılı
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          token: generateToken(user._id),
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };

//get user
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
         res.status(200).json({
            success: true,
            user,
        });

    } 
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
}