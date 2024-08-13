const sequelize = require("../config/db");
const asyncHandler = require("express-async-handler");
const Group = require("../Models/Group");
const { Op } = require("sequelize");
const Teacher = require("../Models/Teacher");
const Session = require("../Models/Session");
const Schedule = require("../Models/Schedule");
const Student = require("../Models/Student");
const PaymentTeacher = require("../Models/PaymentTeacher");

const checkLocationAvailability = () => async (req, res) => {
  const location = req.body.location;
  try {
    await sequelize.sync(); // Ensure models are synchronized with the database

    // Query to find if any group is using the specified location
    const groupsUsingLocation = await Group.findAll({
      where: { location: location },
    });

    if (groupsUsingLocation.length > 0) {
      console.log(`Location ${location} is currently in use.`);
      return false;
    } else {
      console.log(`Location ${location} is available.`);
      return true;
    }
  } catch (error) {
    console.error("Error checking location availability:", error);
  }
};
const getGroupWithCourseName = async (req, res) => {
  try {
    await sequelize.sync();
    const Group = await Group.findAll({
      include: [
        {
          model: Course,
          attributes: ["name"],
        },
      ],
    });
    res.json(Group);
  } catch (error) {
    console.error("Error getting group with course name:", error);
  }
};

const getAllGroup = asyncHandler(async (req, res) => {
  const { theRest } = req.body;

  try {
    // Validate that theRest is defined
    if (typeof theRest !== "string") {
      return res.status(400).json({ error: "Invalid 'theRest' parameter" });
    }

    // Fetch groups with associated teachers
    const groups = await Group.findAll({
      where: {
        theRest: {
          [Op.eq]: theRest, // Use Op.eq for exact matching
        },
      },
      attributes: [
        "id",
        "name",
        "price",
        "type",
        "theRest",
        "numberOfSessions",
        "maxStudents",
        "startDate",
        "endDate",
        "location",
        "isCompleted",
        "paymentMethod",
      ],
      include: [
        {
          model: Teacher,
          attributes: ["id", "fullName"], // Include only the id and fullName of teachers
          as: "teachers",
          through: { attributes: [] }, // Exclude the join table attributes
        },
      ],
    });

    // Format results
    const formattedGroups = groups.map((group) => {
      const groupObj = group.toJSON(); // Convert Sequelize instance to plain object

      // Ensure Teachers property is an array and map it
      const teachers = Array.isArray(groupObj.Teachers)
        ? groupObj.Teachers.map((teacher) => ({
            id: teacher.id,
            name: teacher.fullName,
          }))
        : [];

      return {
        ...groupObj,
        Teachers: teachers,
      };
    });

    res.status(200).json({ groups: formattedGroups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});

const addGroup = async (req, res) => {
  const {
    name,
    price,
    numberOfSessions,
    maxStudents,
    startDate,
    endDate,
    location,
    isCompleted,
    paymentMethod,
    theRest,
    type,
    teacher,
  } = req.body;

  try {
    // Validate incoming data
    if (
      !name ||
      !price ||
      !numberOfSessions ||
      !maxStudents ||
      !startDate ||
      !endDate ||
      !location ||
      !paymentMethod ||
      !theRest ||
      !type ||
      !teacher
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create Group instance
    const group = await Group.create({
      name,
      price,
      type,
      theRest,
      numberOfSessions,
      maxStudents,
      startDate,
      endDate,
      location,
      isCompleted,
      paymentMethod,
    });

    // Step 1: Find the group by ID
    const existingGroup = await Group.findByPk(group.id);

    if (!existingGroup) {
      throw new Error("Group not found");
    }

    // Step 2: Remove all teachers associated with the group
    await existingGroup.setTeachers([]);

    // Step 3: Find the teacher by ID
    const teacherFind = await Teacher.findByPk(teacher);

    if (!teacherFind) {
      throw new Error("Teacher not found");
    }

    // Step 4: Associate the new teacher with the group
    await existingGroup.addTeacher(teacherFind);

    // Return the created group with the associated teacher
    const groupWithTeacher = await Group.findOne({
      where: { id: group.id },
      include: [
        {
          model: Teacher,
          attributes: ["id", "fullName"], // Include only the id and fullName of teachers
          as: "teachers",
          through: { attributes: [] }, // Exclude the join table attributes
        },
      ],
    });

    res.status(201).json({ groupWithTeacher });
  } catch (error) {
    console.error("Error adding group:", error);
    res.status(500).json({ error: "Failed to add group", error });
  }
};

const addTaecherToGroupByID = asyncHandler(async (req, res) => {
  const { teacherId, groupId } = req.body;

  try {
    // Find the teacher and group
    const teacher = await Teacher.findByPk(teacherId);
    const group = await Group.findByPk(groupId);

    // Check if the teacher and group exist
    if (!teacher || !group) {
      return res.status(404).json({ error: "Teacher or group not found" });
    }

    // Add the teacher to the group
    await group.addTeacher(teacher);

    res.status(200).json({ message: "Teacher added to group successfully" });
  } catch (error) {
    console.error("Error adding teacher to group:", error);
    res.status(500).json({ error: "Failed to add teacher to group" });
  }
});
const getGroupByID = asyncHandler(async (req, res) => {
  const { id } = req.body;

  try {
    // Find the group by ID
    const group = await Group.findByPk(id, {
      include: [
        {
          model: Teacher,
          attributes: ["id", "fullName"], // Include only the id and fullName of teachers
          as: "teachers",
          through: { attributes: [] }, // Exclude the join table attributes
        },
        {
          model: Schedule,
          as: "schedules", // Specify the alias used in the association
        },
        {
          model: Student,
          as: "students",
        },
        {
          model: PaymentTeacher,
          as: "groupPayments", // Updated alias
        },
        {
          model: Session,
          as: "sessions",
          include: [
            {
              model: Student,
              as: "students",
            },
          ],
        },
      ],
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Format the group object
    const groupObj = group.toJSON();
    const teachers = Array.isArray(groupObj.Teachers)
      ? groupObj.Teachers.map((teacher) => ({
          id: teacher.id,
          name: teacher.fullName,
        }))
      : [];

    const schedules = Array.isArray(groupObj.schedules)
      ? groupObj.schedules.map((schedule) => ({
          id: schedule.id,
          // Add other schedule properties you want to include
        }))
      : [];

    res.status(200).json({
      group: { ...groupObj, Teachers: teachers, schedules: schedules },
    });
  } catch (error) {
    console.error("Error fetching group by ID:", error);
    res.status(500).json({ error: "Failed to fetch group", error });
  }
});

const deleteGroup = asyncHandler(async (req, res) => {
  const { id } = req.body;

  try {
    // Find the group by ID
    const group = await Group.findByPk(id);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Delete the group
    await group.destroy();

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ error: "Failed to delete group" });
  }
});
const updateGroupStatus = asyncHandler(async (req, res) => {
  const { id, isCompleted } = req.body;

  try {
    // Find the group by ID
    const group = await Group.findByPk(id);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Update the group status
    group.isCompleted = isCompleted;
    await group.save();

    res.status(200).json({ message: "Group status updated successfully" });
  } catch (error) {
    console.error("Error updating group status:", error);
    res.status(500).json({ error: "Failed to update group status" });
  }
});
const updateGroup = asyncHandler(async (req, res) => {
  const {
    id,
    name,
    type,
    numberOfSessions,
    maxStudents,
    paymentMethod,
    teacher,
    price,
  } = req.body;

  // Input validation

  try {
    // Find the group and teacher in parallel
    const [group, teacherFind] = await Promise.all([
      Group.findByPk(id),
      Teacher.findByPk(teacher),
    ]);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!teacherFind) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Update the group
    await group.update({
      name,
      type,
      price,
      numberOfSessions,
      maxStudents,
      paymentMethod,
    });

    // Update the teacher association
    await group.setTeachers([teacherFind]);

    res.status(200).json({ message: "Group updated successfully", group });
  } catch (error) {
    console.error("Error updating group:", error);
    res
      .status(500)
      .json({ error: "Failed to update group", details: error.message });
  }
});

const getGroupByTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.body;

  try {
    // Fetch all groups associated with the teacher through the TeacherGroup join table
    const groups = await Group.findAll({
      include: [
        {
          model: Teacher,
          as: "teachers",
          where: { id: teacherId }, // Filter based on the teacher's ID
          through: {
            attributes: [], // This prevents Sequelize from including the join table data in the response
          },
        },
        {
          model: PaymentTeacher,
          as: "groupPayments",
        },
        {
          model: Session,
          as: "sessions",
          include: [
            {
              model: Student,
              as: "students",
            },
          ],
        },
      ],
    });

    res.status(200).json({ groups });
  } catch (error) {
    console.error("Error fetching groups with teacher payments:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch groups with teacher payments" });
  }
});

module.exports = {
  checkLocationAvailability,
  getGroupWithCourseName,
  addGroup,
  getAllGroup,
  addTaecherToGroupByID,
  getGroupByID,
  deleteGroup,
  updateGroupStatus,
  updateGroup,
  getGroupByTeacher,
};
