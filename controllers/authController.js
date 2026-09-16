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

    const lowerId = String(identifier).toLowerCase().trim();
    let role = 'STAFF';
    let centerId = 'CENTER-001';

    // Role and Center Routing
    if (lowerId.startsWith('farm')) {
      role = 'FARMER';
    } else if (lowerId.startsWith('manager')) {
      role = 'MANAGER';
      if (lowerId === 'manager01' || lowerId === 'manager-001') {
        centerId = 'CENTER-001';
      } else if (lowerId === 'manager02' || lowerId === 'manager-002') {
        centerId = 'CENTER-002';
      } else {
        // manager03 or supervisor views all centers
        centerId = 'ALL';
      }
    } else if (lowerId === 'staff02' || lowerId === 'staff-002' || lowerId.includes('staff02')) {
      role = 'STAFF';
      centerId = 'CENTER-002';
    } else {
      role = 'STAFF';
      centerId = 'CENTER-001';
    }

    const userPayload = {
      id: identifier,
      username: identifier,
      role: role,
      centerId: centerId
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userPayload,
      data: userPayload
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