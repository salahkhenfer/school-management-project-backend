const { Op } = require("sequelize");
const Group = require("../Models/Group");
const Student = require("../Models/Student");
const Session = require("../Models/Session");

async function getGroupsWithStudentsAndCompletedSessions(studentIds) {
  try {
    const groups = await Group.findAll({
      include: [
        {
          model: Student,
          as: "students",
          where: {
            id: {
              [Op.in]: studentIds,
            },
          },
          through: {
            attributes: [], // No additional fields from StudentGroup
          },
          include: [
            {
              model: Session,
              as: "sessions",
              attributes: ["id", "isCompleted"],
              through: {
                attributes: [], // No additional fields in SessionStudent
              },
            },
          ],
        },
        {
          model: Session,
          as: "sessions",
          attributes: ["id", "isCompleted"],
        },
      ],
      order: [["name", "ASC"]],
    });

    // Process the results to include completed session information
    const processedGroups = groups.map((group) => {
      const processedStudents = group.students.map((student) => {
        // Count the number of completed sessions for the student
        const completedSessions = student.sessions.filter(
          (session) => session.isCompleted
        ).length;

        return {
          id: student.id,
          fullName: student.fullName,
          completedSessions,
          totalSessions: student.sessions.length,
        };
      });

      return {
        id: group.id,
        name: group.name,
        totalSessions: group.sessions.length,
        completedSessions: group.sessions.filter(
          (session) => session.isCompleted
        ).length,
        students: processedStudents,
      };
    });

    return processedGroups;
  } catch (error) {
    console.error(
      "Error fetching groups with students and completed sessions: ",
      error
    );
    res.status(500).json({
      error: "Failed to fetch groups with students",
      details: error.message,
    });
  }
}
module.exports = {
  getGroupsWithStudentsAndCompletedSessions,
};
