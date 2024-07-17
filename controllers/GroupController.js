const sequelize = require("../config/db");
const Grupe = require("./Grupe");

export async function checkLocationAvailability() {
  const location = req.body.location;
  try {
    await sequelize.sync(); // Ensure models are synchronized with the database

    // Query to find if any group is using the specified location
    const groupsUsingLocation = await Grupe.findAll({
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
}
export getGrupeWithCourseName = async (req, res) => {
  try {
    await sequelize.sync();
    const grupe = await Grupe.findAll({
      include: [
        {
          model: Course,
          attributes: ["name"],
        },
      ],
    });
    res.json(grupe);
  } catch (error) {
    console.error("Error getting group with course name:", error);
  }
}

module.exports = {
  checkLocationAvailability,
};

