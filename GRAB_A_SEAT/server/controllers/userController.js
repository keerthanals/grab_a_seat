const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const createToken = require('../utils/generateToken');

// Register Controller
const register = async (req, res) => {
    try {
        const { name, email, password, profilePic, role = 'user' } = req.body || {};
        console.log(name, email, password, role);

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate role
        const validRoles = ['user', 'admin', 'owner'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profilePic,
            role: role,
            status: role === 'admin' ? 'pending' : 'active'
        });

        const savedUser = await newUser.save();

        // Remove password before sending user data
        const userData = savedUser.toObject();
        delete userData.password;

        // For admin role, don't generate token, just return success
        if (role === 'admin') {
            return res.status(200).json({ 
                message: 'Admin registration submitted for approval', 
                user: userData,
                requiresApproval: true 
            });
        }

        // Generate token for other roles
        const token = createToken(savedUser._id, savedUser.role);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        // Send response
        res.status(200).json({ message: 'User registered successfully', user: userData, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if admin account is pending approval
        if (user.role === 'admin' && user.status === 'pending') {
            return res.status(403).json({ message: 'Your admin account is pending approval' });
        }

        // Check if account is rejected
        if (user.status === 'rejected') {
            return res.status(403).json({ 
                message: `Your account was rejected. Reason: ${user.rejectionReason || 'No reason provided'}` 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Use imported createToken function here:
        const token = createToken(user._id, user.role);

        // Remove password before sending user data
        const userObject = user.toObject();
        delete userObject.password;

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: userObject
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

//profile controller
const profile = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have the user ID from the token

        // Find user by ID
        const userData = await User.findById(userId).select('-password'); // Exclude password from the response
        res.status(200).json({ message: 'User profile fetched successfully', data: userData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// logout controller
const logout = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        // Send response
        res.status(200).json({ message: 'Logout successful' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//update profile controller
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have the user ID from the token
        const { name, email, password, profilePic } = req.body || {};

        // Validate input
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user data
        user.name = name;
        user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        if (profilePic) {
            user.profilePic = profilePic;
        }

        const updatedUser = await user.save();

        // Remove password before sending user data
        const userData = updatedUser.toObject();
        delete userData.password;

        // Send response
        res.status(200).json({ message: 'Profile updated successfully', data: userData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//delete profile controller
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user
        await User.findByIdAndDelete(userId);

        // Send response
        res.status(200).json({ message: 'User deleted successfully', });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { register, login, profile, logout, updateProfile, deleteUser };