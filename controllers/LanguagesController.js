const Languages = require("../Models/Languages");

const asyncHandler = require("express-async-handler");

/**
 * @route GET /allLanguages
 * @description Get all languages
 * @access Public
 */
const getAllLanguages = asyncHandler(async (req, res) => {
  const languages = await Languages.findAll();
  res.status(200).json({ languages });
});

/**
 * @route post / addLanguage
 * @description add  language
 * @access Public
 *
 */

const addLanguage = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const language = await Languages.create({ name });
  res.status(201).json({ language });
});

/**
 * @route delete / deleteLanguage
 * @description delete  language
 * @access Public
 *
 */

const deleteLanguage = asyncHandler(async (req, res) => {
  const { id } = req.body; // Correctly extract id from req.params

  if (!id) {
    return res.status(400).json({ message: "Language ID is required" });
  }

  try {
    const language = await Languages.findOne({ where: { id } });

    if (!language) {
      return res.status(404).json({ message: "Language not found" });
    }

    await Languages.destroy({ where: { id } });

    res.status(200).json({ message: "Language deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = {
  getAllLanguages,
  addLanguage,
  deleteLanguage,
};
