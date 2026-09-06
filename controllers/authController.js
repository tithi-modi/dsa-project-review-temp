// Stub handler: Staff Login
exports.loginStaff = (req, res) => {
  const { username } = req.body;
  res.status(200).json({
    success: true,
    message: "Staff authentication successful (Stub)",
    token: "mock-jwt-token-xyz789",
    user: {
      username: username || "staff_operator",
      role: "INTAKE_STAFF",
      centerId: "CENTER-01"
    }
  });
};