const { Op } = require("sequelize");
const Group = require("../Models/Group");
const Teacher = require("../Models/Teacher");
const asyncHandler = require("express-async-handler");

const addTeachers = asyncHandler(async (req, res) => {
  const { fullName, phoneNumber, email, password } = req.body;

  try {
    // Validate incoming data
    if (!fullName || !phoneNumber || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if a teacher with the same email or phone number already exists
    const existingTeacher = await Teacher.findOne({
      where: {
        [Op.or]: [{ phoneNumber }],
      },
    });

    if (existingTeacher) {
      return res.status(409).json({
        error: "Teacher with the same email or phone number already exists",
      });
    }

    // Create a new teacher
    const teacher = await Teacher.create({
      fullName,
      phoneNumber,
      email,
      password, // Consider hashing this password in your model hook
    });

    res.status(201).json({ teacher });
  } catch (error) {
    console.error("Error creating teacher:", error);
    res
      .status(500)
      .json({ error: `Failed to create teacher: ${error.message}` });
  }
});

const GetAllTeachers = asyncHandler(async (req, res) => {
  try {
    // Fetch all teachers
    const teachers = await Teacher.findAll({
      include: [{ model: Group, as: "groups" }],
    });

    // Transform teacher instances to plain objects and remove the password field
    const teachersWithoutPassword = teachers.map((teacher) => {
      const teacherObj = teacher.toJSON(); // Convert Sequelize instance to plain object
      const { password, ...teacherWithoutPassword } = teacherObj; // Destructure to remove password
      return teacherWithoutPassword;
    });

    res.status(200).json({ teachers: teachersWithoutPassword });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch teachers", details: error.message });
  }
});
const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.body;

  try {
    // Validate incoming data
    if (!id) {
      return res.status(400).json({ error: "Teacher ID is required" });
    }

    // Find the teacher
    const teacher = await Teacher.findOne({ where: { id } });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Delete the teacher
    await teacher.destroy();

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ error: "Failed to delete teacher" });
  }
});

const getTeacherById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  try {
    // Validate incoming data

    if (!id) {
      return res.status(400).json({ error: "Teacher ID is required" });
    }

    // Find the teacher
    const teacher = await Teacher.findOne({
      where: { id },
      include: [{ model: Group, as: "groups" }],
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.status(200).json({ teacher });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch teacher", details: error.message });
  }
});

const searchTeachers = asyncHandler(async (req, res) => {
  const { fullName } = req.body;

  try {
    // Validate incoming data
    if (!fullName) {
      return res.status(400).json({ error: "Teacher full name is required" });
    }

    // Search for teachers
    const teachers = await Teacher.findAll({
      where: {
        fullName: {
          [Op.like]: `%${fullName}%`,
        },
      },
    });

    res.status(200).json({ teachers });
  } catch (error) {
    console.error("Error searching teachers:", error);
    res.status(500).json({ error: "Failed to search teachers" });
  }
});

const countTeachers = asyncHandler(async (req, res) => {
  try {
    // Count all teachers
    const count = await Teacher.count();

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting teachers:", error);
    res.status(500).json({ error: "Failed to count teachers" });
  }
});
module.exports = {
  addTeachers,
  GetAllTeachers,
  deleteTeacher,
  getTeacherById,
  searchTeachers,
  countTeachers,
};
