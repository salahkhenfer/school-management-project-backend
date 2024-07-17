// controllers/StudentController.js
const Student = require("../Models/Student");
const Parent = require("../Models/Parent");

const addStudent = async (req, res) => {
  try {
    let newParent;

    if (
      req.body.parentFullName &&
      req.body.parentEmail &&
      req.body.parentPhone
    ) {
      // Create a new parent if parentFullName is provided
      newParent = await Parent.create({
        fullName: req.body.parentFullName,
        email: req.body.parentEmail,
        phone: req.body.parentPhone,
        password: req.body.password,
      });
    }

    // Create a new student
    const newStudent = await Student.create({
      fullName: req.body.fullName,
      age: req.body.age,
      grade: req.body.grade,
      regiments: req.body.regiments,
    });

    // Associate the parent with the student if parent exists
    if (newParent) {
      await newStudent.setParent(newParent);
    }

    res.status(201).send({ message: "Student created successfully." });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const getAllStudentsController = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        {
          model: Parent,
          as: "parent",
        },
      ],
    });
    res.status(200).json({ students });
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

module.exports = {
  addStudent,
  getAllStudentsController,
  getStudentById,
  updateStudent,
  deleteStudent,
};
