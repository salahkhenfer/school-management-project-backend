const Group = require("../Models/Group");
const Session = require("../Models/Session");
const Student = require("../Models/Student");
const addSessionToGroup = async (req, res) => {
  const { groupId, studentIds } = req.body;

  try {
    if (!studentIds) {
      // Add the session to the group

      return res.status(400).send({ error: "Missing required fields" });
    }
    // Check if the group exists
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).send({ error: "Group not found" });
    }

    // Determine the next session number
    const sessionCount = await Session.count({ where: { groupId } });
    const sessionNumber = sessionCount + 1;

    // Create a new session
    const session = await Session.create({
      sessionNumber,
      isCompleted: true, // Default value
    });

    if (studentIds.length > 0) {
      const groupStudentIds = studentIds.map((student) => student.id);

      console.log("Group student IDs:", groupStudentIds);

      // Fetch valid students and add them to the session
      const validStudents = await Student.findAll({
        where: { id: groupStudentIds },
      });

      console.log("Valid students:", validStudents);

      await session.addStudents(validStudents);
    }

    // Add the session to the group
    await group.addSession(session);

    res.status(201).json({ session });
  } catch (error) {
    console.error("Error creating session:", error);
    res
      .status(500)
      .json({ error: "Failed to create session", details: error.message });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await Session.findAll({
      include: [
        {
          model: Student,
          as: "students",
          attributes: ["id", "fullName"],
          through: { attributes: [] },
        },
      ],
    });

    res.json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch sessions", details: error.message });
  }
};

const getSessionById = async (req, res) => {
  const { id } = req.body;

  try {
    const session = await Session.findByPk(id, {
      include: [
        {
          model: Student,
          as: "students",
          through: { attributes: [] },
        },
      ],
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ session });
  } catch (error) {
    console.error("Error fetching session:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch session", details: error.message });
  }
};
module.exports = { addSessionToGroup, getSessions, getSessionById };
