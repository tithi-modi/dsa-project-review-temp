// controllers/authController.js

exports.loginStaff = async (req, res) => {
  try {
    const { username, staffId, farmerId, id } = req.body;
    const identifier = username || staffId || farmerId || id;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Username or ID is required'
      });
    }

    let role = 'staff';
    const lowerId = String(identifier).toLowerCase();

    if (lowerId.startsWith('farm')) {
      role = 'farmer';
    } else if (lowerId.startsWith('manager')) {
      role = 'manager';
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: identifier,
        username: identifier,
        role: role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
};