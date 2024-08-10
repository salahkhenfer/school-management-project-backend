const Course = require("../Models/Course");

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();

    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

const addCourse = async (req, res) => {
  const { name } = req.body;

  try {
    // Validate incoming data
    if (!name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create Course instance
    const course = await Course.create({
      name,
    });

    res.status(201).json({ course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create course" });
  }
};
const deleteCourse = async (req, res) => {
  const { id } = req.body;

  try {
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.destroy();

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

module.exports = { getAllCourses, addCourse, deleteCourse };
