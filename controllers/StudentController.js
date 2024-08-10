// controllers/StudentController.js
const Student = require("../Models/Student");
const Parent = require("../Models/Parent");
const Group = require("../Models/Group");
const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");
const Payment = require("../Models/Payment");
const addStudent = async (req, res) => {
  const { fullName, birthDay, price, groupId, parent: parentData } = req.body;

  try {
    // Check if the student already exists
    let student = await Student.findOne({
      where: {
        fullName,
        birthDay: new Date(birthDay), // Ensure date format is consistent
      },
    });

    if (!student) {
      student = await Student.create({
        fullName,
        birthDay,
      });
    }

    // Check if the group exists and add the student to the group if it does
    if (groupId) {
      const group = await Group.findByPk(groupId);
      if (group) {
        // Check if the student is already in the group
        const isStudentInGroup = await group.hasStudent(student);
        if (!isStudentInGroup) {
          // Add student to the group
          await group.addStudent(student);

          // Create payment
          const payment = await Payment.create({
            amount: price,
            groupId,
            studentId: student.id,
          });

          await student.addPayment(payment);
        } else {
          return res
            .status(400)
            .send({ error: "Student is already in the group" });
        }
      } else {
        return res.status(404).send({ error: "Group not found" });
      }
    }

    // If there's a parent, create or find the parent and associate it with the student
    if (parentData) {
      let parent = await Parent.findOne({ where: { email: parentData.email } });
      if (!parent) {
        parent = await Parent.create(parentData);
      }
      await student.setParent(parent);
    }

    res
      .status(201)
      .send({ message: "Student created/updated successfully.", student });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getAllStudentsController = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.body;

    const limit = parseInt(pageSize);
    const offset = (page - 1) * limit;

    const { count, rows: students } = await Student.findAndCountAll({
      include: [
        {
          model: Parent,
          as: "parent",
        },

        {
          model: Group,
          through: { attributes: [] }, // لإزالة معلومات الجدول الوسيط من النتيجة
          as: "groups",
        },
      ],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      students,
      currentPage: parseInt(page),
      totalPages,
      totalStudents: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};
const getStudentById = async (req, res) => {
  const studentId = req.body.id;

  try {
    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: Parent,
          as: "parent",
        },

        {
          model: Payment,
          as: "payments",
        },
        {
          model: Group,
          through: { attributes: [] }, // لإزالة معلومات الجدول الوسيط من النتيجة
          as: "groups",
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch student" });
  }
};
const updateStudent = async (req, res) => {
  const studentId = req.body.id;
  try {
    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.update(req.body);

    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update student" });
  }
};

const deleteStudent = async (req, res) => {
  const studentId = req.body.id;
  try {
    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.destroy();

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

const searchStudent = async (req, res) => {
  const { fullName } = req.body;

  try {
    const students = await Student.findAll({
      where: {
        fullName: {
          [Op.like]: `%${fullName}%`, // Case-insensitive search
        },
      },
      include: [
        {
          model: Parent,
          as: "parent", // Ensure this alias matches your model definition
        },
      ],
    });

    res.status(200).json({ students });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to search for students", details: err.message });
  }
};
const  countStudents = async (req, res) => {
  try {
    const count = await Student.count();
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to count students" });
  }
};

module.exports = {
  addStudent,
  getAllStudentsController,
  getStudentById,
  updateStudent,
  searchStudent,
  deleteStudent,
  countStudents,
};
