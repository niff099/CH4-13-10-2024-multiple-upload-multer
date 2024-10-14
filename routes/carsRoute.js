const express = require("express");
const router = express.Router();
const carController = require("../controller/carController");
const upload = require("../middlewares/uploader");

// Cars API
router.post("/", upload.array("image"), carController.createCar);
router.get("/", carController.getAllCars);
router.get("/:id", carController.getCarById);
router.delete("/:id", carController.deleteCarById);
router.patch("/:id", carController.updateCar);

module.exports = router;
