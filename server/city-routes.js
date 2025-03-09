const express = require("express");
const router = express.Router();
const cityController = require("./controllers/cityController");

router.get("/", cityController.getCities);
router.post("/", cityController.createCity);
router.put("/:guid", cityController.updateCity);
router.delete("/:guid", cityController.deleteCity);
router.get("/weather", cityController.getWeatherForCity);

module.exports = router;
