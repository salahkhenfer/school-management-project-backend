const asyncHandler = require("express-async-handler");
const Group = require("../Models/Group");
const Schedule = require("../Models/Schedule");
const { Op } = require("sequelize");
const Regiment = require("../Models/Regiment");

const addSchedule = asyncHandler(async (req, res) => {
  const { groupID, day, startTime, endTime, location, regimentId } = req.body;

  // Find the group by primary key
  const group = await Group.findByPk(groupID);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  // Create a new schedule
  const schedule = await Schedule.create({
    day,
    startTime,
    endTime,
    location,
    startDate: group.startDate,
    endDate: group.endDate,
  });

  // Find the regiment by primary key
  const regiment = await Regiment.findByPk(regimentId);
  if (!regiment) {
    return res.status(404).json({ message: "Regiment not found" });
  }

  // Associate the schedule with the group and regiment
  await group.addSchedule(schedule);
  regiment.ScheduleId = schedule.id;
  await regiment.save(); // Save the regiment with the updated foreign key

  // Respond with a success message
  res.status(201).json({ message: "Schedule added successfully", schedule });
});

const getAllFreeRegiments = asyncHandler(async (req, res) => {
  const { startDate, endDate, startTime, endTime, day } = req.body;

  // Find regiments with overlapping schedules
  const occupiedRegiments = await Regiment.findAll({
    include: {
      model: Schedule,
      where: {
        [Op.and]: [
          // Overlapping date range
          {
            [Op.or]: [
              {
                startDate: { [Op.lte]: endDate },
                endDate: { [Op.gte]: startDate },
              },
            ],
          },
          // Overlapping time range on the specified day
          {
            day: day,
            [Op.or]: [
              {
                startTime: { [Op.lte]: endTime },
                endTime: { [Op.gte]: startTime },
              },
              {
                startTime: { [Op.lte]: startTime },
                endTime: { [Op.gte]: endTime },
              },
            ],
          },
        ],
      },
    },
  });

  const occupiedRegimentIds = occupiedRegiments.map((regiment) => regiment.id);

  // Find regiments that are not occupied
  const freeRegiments = await Regiment.findAll({
    where: {
      id: {
        [Op.notIn]: occupiedRegimentIds.length > 0 ? occupiedRegimentIds : [0], // Handle case with no occupied regiments
      },
    },
  });

  res.status(200).json({ freeRegiments });
});
const addRegiment = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const regiment = await Regiment.create({ name });
  res.status(201).json({ regiment });
});

const getRegimentById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const regiment = await Regiment.findByPk(id);

  if (!regiment) {
    return res.status(404).json({ message: "Regiment not found" });
  }

  res.status(200).json({ regiment });
});

const getAllRegiments = asyncHandler(async (req, res) => {
  const regiments = await Regiment.findAll();
  res.status(200).json({ regiments });
});

const getRegimentByScheduleId = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const regiment = await Regiment.findOne({
    where: { ScheduleId: id },
  });

  if (!regiment) {
    return res.status(404).json({ message: "Regiment not found" });
  }

  res.status(200).json({ regiment });
});

const deleteSchedule = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const schedule = await Schedule.findByPk(id);

  if (!schedule) {
    return res.status(404).json({ message: "Schedule not found" });
  }

  await schedule.destroy();

  res.status(200).json({ message: "Schedule deleted successfully" });
});

const getScheduleById = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const schedule = await Schedule.findByPk(id);

  if (!schedule) {
    return res.status(404).json({ message: "Schedule not found" });
  }

  res.status(200).json({ schedule });
});
const updateSchedule = asyncHandler(async (req, res) => {
  const { id, day, startTime, endTime, location } = req.body;

  const schedule = await Schedule.findByPk(id);

  if (!schedule) {
    return res.status(404).json({ message: "Schedule not found", id });
  }

  schedule.day = day;
  schedule.startTime = startTime;
  schedule.endTime = endTime;
  schedule.location = location;

  await schedule.save();

  res.status(200).json({ message: "Schedule updated successfully" });
});
const getAllSchedule = asyncHandler(async (req, res) => {
  const schedules = await Schedule.findAll();
  res.status(200).json({ schedules });
});
const deleteRegiment = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const regiment = await Regiment.findByPk(id);

  if (!regiment) {
    return res.status(404).json({ message: "Regiment not found" });
  }

  await regiment.destroy();

  res.status(200).json({ message: "Regiment deleted successfully" });
});
module.exports = {
  addSchedule,
  getAllFreeRegiments,
  addRegiment,
  getScheduleById,
  updateSchedule,
  getRegimentById,
  getAllRegiments,
  getRegimentByScheduleId,
  deleteSchedule,
  getAllSchedule,
  getAllRegiments,
  deleteRegiment,
};
