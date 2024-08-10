const Permission = require("../Models/Permission");
const User = require("../Models/User");

const addPermission = async (req, res) => {
  const { permissionType } = req.body;

  try {
    const permission = await Permission.create({
      permissionType,
    });
    res.status(201).json({ permission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add permission" });
  }
};
const createPermission = async (req, res) => {
  const { username, name, password, email, phone, permissions } = req.body;

  // Validate input
  if (!username || !password || !name || !email || !phone || !permissions) {
    return res.status(400).json({
      error: "All fields are required and permissions must be an object",
    });
  }

  // Validate permissions against allowed values
  const allowedPermissions = ["classes", "users", "financial"];
  const invalidPermissions = Object.keys(permissions).filter(
    (key) => !allowedPermissions.includes(key)
  );

  if (invalidPermissions.length > 0) {
    return res.status(400).json({
      error: `Invalid permission types: ${invalidPermissions.join(", ")}`,
    });
  }

  try {
    const existingUser = await User.findOne({
      where: { username },
    });
    if (existingUser) {
      return res.status(409).json({
        error: "User with the same username already exists",
      });
    }
    // Create a new user
    const user = await User.create({
      email,
      name,
      phone,
      username,
      password,
      role: "sub-admin",
    });

    // Create and associate permissions with the user
    for (let [permissionType, isGranted] of Object.entries(permissions)) {
      if (isGranted) {
        const permission = await Permission.create({
          permissionType,
        });
        await user.addPermission(permission);
      }
    }

    // Respond with the created user and permissions
    res.status(201).json({ user, permissions });
  } catch (error) {
    console.error("Error creating permission:", error);
    res
      .status(500)
      .json({ error: "Failed to add permission", details: error.message });
  }
};

const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json({ permissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch permissions" });
  }
};

const getPermissionByUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const permissions = await Permission.findAll({
      where: { userId },
    });

    res.status(200).json({ permissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch permissions" });
  }
};
const getUsersByRole = async (req, res) => {
  const { role } = req.body;

  // Validate input
  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }

  try {
    const users = await User.findAll({
      where: { role },
      include: [{ model: Permission, as: "permissions" }],
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch users", details: error.message });
  }
};

module.exports = {
  addPermission,
  createPermission,
  getAllPermissions,
  getPermissionByUser,
  getUsersByRole,
};
