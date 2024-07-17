const express = require("express");
const asyncHandler = require("express-async-handler");
const authenticate = require("../Middlewares/Auth/authenticate");
const {
  getAllLanguages,
  addLanguage,
  deleteLanguage,
} = require("../controllers/LanguagesController");

const router = express.Router();

/**
 * @route GET /allLanguages
 * @description Get all languages
 * @access Public
 */

router.get("/allLanguages", authenticate, getAllLanguages);

/**
 * @route post / addLanguage
 * @description add  language
 * @access Public
 */

router.post("/addLanguage", authenticate, addLanguage);

/**
 * @route delete / deleteLanguage
 * @description delete  language
 * @access Public
 *
 */

router.delete("/deleteLanguage", deleteLanguage);

module.exports = router;
