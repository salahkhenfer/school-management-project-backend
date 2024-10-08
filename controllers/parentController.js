const { Op } = require("sequelize");
const Parent = require("../Models/Parent");
const Student = require("../Models/Student");
const User = require("../Models/User");
const {
  getGroupsWithStudentsAndCompletedSessions,
} = require("../Middlewares/pearntsMeddlewares");
const Group = require("../Models/Group");
const e = require("express");
const addParent = async (req, res) => {
  const { fullName, email, password, phoneNumber, studentId } = req.body;

  try {
    // Validate incoming data
    if (!fullName || !email || !password || !phoneNumber) {
      return res
        .status(400)
        .json({ error: "Missing required fields", req: req.body });
    }

    // Find or create Parent instance
    let user = await User.findOne({ where: { email } }); // Assuming email is unique

    if (user) {
      return res.status(409).json({
        error: "User with the same email already exists",
      });
    }
    let parent = await Parent.findOne({ where: { phoneNumber } }); // Assuming email is unique
    if (!parent) {
      // Create new parent if not found
      parent = await Parent.create({
        fullName,
        email,
        password,
        phoneNumber,
        address: "",
      });
    }

    // If there's a studentId, add the student to the parent if not already associated
    if (studentId) {
      let student = await Student.findOne({ where: { id: studentId } });

      if (student) {
        // Add the student to the parent
        await parent.addStudent(student); // This method should be available if the associations are correct
      } else {
        // Handle case where student is not found
        return res.status(404).json({ error: "Student not found" });
      }
    }

    res.status(201).json({ parent });
  } catch (error) {
    console.error("Error details:", error); // Log detailed error
    res.status(500).json({
      error: "Failed to create or update parent",
      details: error.message,
    });
  }
};
const addStudentInToParent = async (req, res) => {
  const { phoneNumber, studentId } = req.body;

  try {
    // Validate incoming data
    if (!phoneNumber || !studentId) {
      return res
        .status(400)
        .json({ error: "Missing required fields", req: req.body });
    }

    // Find Parent instance
    let parent = await Parent.findOne({ where: { phoneNumber } });

    if (!parent) {
      return res.status(201).json({ message: "Parent" });
    }

    // Find Student instance
    let student = await Student.findOne({ where: { id: studentId } });

    if (!student) {
      return res.status(404).json({ message: "Student" });
    }

    // Add the student to the parent
    await parent.addStudent(student);

    res.status(201).json({ parent });
  } catch (error) {
    console.error("Error details:", error); // Log detailed error
    res.status(500).json({
      error: "Failed to add student to parent",
      details: error.message,
    });
  }
};
const checkParent = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Validate incoming data
    if (!phoneNumber) {
      return res
        .status(400)
        .json({ error: "Missing required fields", req: req.body });
    }

    // Find Parent instance
    let parent = await Parent.findOne({ where: { phoneNumber } });

    if (!parent) {
      return res.status(201).json({ message: "NotParent" });
    }
    res.status(201).json({ message: "Parent" });
  } catch (error) {
    console.error("Error details:", error); // Log detailed error
    res.status(500).json({
      error: "Failed to add student to parent",
      details: error.message,
    });
  }
};

const getAllParents = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;

    const { count, rows: parents } = await Parent.findAndCountAll({
      offset,
      limit: parseInt(limit),
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      parents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch parents" });
  }
};

const getParentById = async (req, res) => {
  const parentId = req.body.id;

  try {
    const parent = await Parent.findByPk(parentId, {
      include: [
        {
          model: Student,
          as: "students", // Ensure this alias matches the association definition
        },
      ],
    });

    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }

    res.status(200).json({ parent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch parent" });
  }
};

const updateParent = async (req, res) => {
  const { id, name, email, password, phone, address } = req.body;

  try {
    const parent = await Parent.findByPk(id);

    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }

    await parent.update({ name, email, password, phone, address });

    res.status(200).json({ parent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update parent" });
  }
};

const deleteParent = async (req, res) => {
  const parentId = req.body.id;

  try {
    const parent = await Parent.findByPk(parentId);
    const user = await User.findOne({ where: { email: parent.email } });

    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }

    await parent.destroy();
    await user.destroy();

    res.status(200).json({ message: "Parent deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete parent" });
  }
};

const searchParent = async (req, res) => {
  const name = req.body.name;

  try {
    const parents = await Parent.findAll({
      where: {
        fullName: {
          [Op.like]: `%${name}%`,
        },
      },
    });

    res.status(200).json({ parents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch parents" });
  }
};

const deleteStudentForParent = async (req, res) => {
  const { parentId, studentId } = req.body;

  try {
    const parent = await Parent.findByPk(parentId);

    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if the student belongs to the parent
    if (student.parentId !== parentId) {
      return res
        .status(400)
        .json({ error: "Student does not belong to the parent" });
    }

    // Remove the association by setting parentId to null
    student.parentId = null;
    await student.save();

    res
      .status(200)
      .json({ message: "Student removed successfully from parent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove student from parent" });
  }
};
const deleteStudentFromParent = async (req, res) => {
  const { parentId, studentId } = req.body;

  try {
    const parent = await Parent.findByPk(parentId);

    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if the student belongs to the parent
    if (student.parentId !== parentId) {
      return res
        .status(400)
        .json({ error: "Student does not belong to the parent" });
    }

    // Remove the association by setting parentId to null
    student.parentId = null;
    await student.save();

    parent.removeStudent(student);

    res
      .status(200)
      .json({ message: "Student removed successfully  from parent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove student from parent" });
  }
};

const countParents = async (req, res) => {
  try {
    const count = await Parent.count();

    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to count parents" });
  }
};

const getGroupsWithStudentsAndSessionsApi = async (req, res) => {
  const { studentIds } = req.body;

  if (!studentIds || !Array.isArray(studentIds)) {
    return res
      .status(400)
      .json({ error: "Invalid input. 'studentIds' must be an array." });
  }

  try {
    const groups = await getGroupsWithStudentsAndCompletedSessions(studentIds);
    res.status(200).json({ groups });
  } catch (error) {
    console.error("Error fetching groups with students and sessions:", error);
    res.status(500).json({
      error: "Failed to fetch groups with students and sessions",
      details: error.message,
    });
  }
};

const getParentWithUser = async (req, res) => {
  const { email, name, phoneNumber } = req.body;

  console.log(email, name, phoneNumber);
  // Validate the required fields
  if (!email || !name || !phoneNumber) {
    return res
      .status(400)
      .json({ error: "Missing required fields: email, name, or phone" });
  }

  try {
    const parent = await Parent.findOne({
      where: {
        email,
        fullName: name,
        phoneNumber: phoneNumber,
      },
      include: [
        {
          model: Student,
          as: "students",
          include: [
            {
              model: Group,
              as: "groups",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }

    res.status(200).json({
      parent: {
        ...parent.toJSON(),
        role: "parent",
      },
    });
  } catch (error) {
    console.log("Error fetching parent with user:", error);
    res.status(500).json({ error: "Failed to fetch parent" });
  }
};

module.exports = {
  addParent,
  getAllParents,
  getParentById,
  updateParent,
  deleteParent,
  searchParent,
  addStudentInToParent,
  deleteStudentForParent,
  checkParent,
  deleteStudentFromParent,
  countParents,
  getGroupsWithStudentsAndSessionsApi,
  getParentWithUser,
};
