const { Car } = require("../models");
const imagekit = require("../lib/imagekit");

async function getAllCars(req, res) {
  try {
    // console.log("Proses kapan request");
    // console.log(req.requestTime);
    // console.log("Proses siapa yang request");
    // console.log(req.username);
    // console.log("Proses API apa yang diminta");
    // console.log(req.originalUrl);
    const cars = await Car.findAll();

    res.status(200).json({
      status: "200",
      message: "Success get cars data",
      isSuccess: true,
      data: { cars },
    });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Failed to get cars data",
      isSuccess: false,
      error: error.message,
    });
  }
}

async function getCarById(req, res) {
  const id = req.params.id;
  try {
    const car = await Car.findByPk(id);

    if (!car) {
      return res.status(404).json({
        status: "404",
        message: "Car Not Found!",
      });
    }

    res.status(200).json({
      status: "200",
      message: "Success get cars data",
      isSuccess: true,
      data: { car },
    });
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Failed to get cars data",
      isSuccess: false,
      error: error.message,
    });
  }
}

async function deleteCarById(req, res) {
  const id = req.params.id;
  try {
    const car = await Car.findByPk(id);

    if (car) {
      await car.destroy();

      res.status(200).json({
        status: "200",
        message: "Success get cars data",
        isSuccess: true,
        data: { car },
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "Car Not Found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Failed to get cars data",
      isSuccess: false,
      error: error.message,
    });
  }
}

async function updateCar(req, res) {
  const id = req.params.id;
  const { plate, model, type, year } = req.body;

  try {
    const car = await Car.findByPk(id);

    if (car) {
      car.plate = plate;
      car.model = model;
      car.type = type;
      car.year = year;

      await car.save();

      res.status(200).json({
        status: "200",
        message: "Success get cars data",
        isSuccess: true,
        data: { car },
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "Car Not Found!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Failed to get cars data",
      isSuccess: false,
      error: error.message,
    });
  }
}

async function createCar(req, res) {
  const file = req.files;
  console.log(file);
  const newImages = [];

  if (!file || file.length === 0) {
    return res.status(400).json({
      status: "Failed",
      message: "No files uploaded",
      isSuccess: false,
      data: null,
    });
  }

  for (let i = 0; i < file.length; i++) {
    const newFile = file[i];
    console.log(newFile);

    // processing file
    const split = newFile.originalname.split(".");
    const ext = split[split.lenght - 1];
    const filename = split[0];

    //  upload image ke server
    const uploadedImage = await imagekit.upload({
      file: newFile.buffer,
      fileName: `Profile-${filename}-${Date.now()}.${ext}`,
    });

    console.log(uploadedImage);

    if (!uploadedImage) {
      res.status(400).json({
        status: "Failed",
        message: "Failed to add user data because file not found",
        isSuccess: false,
        data: null,
      });
    }

    newImages.push(uploadedImage.url);
  }

  console.log(newImages);

  const newCar = req.body;

  try {
    await Car.create({ ...newCar, image: newImages });
    res.status(200).json({
      status: "Success",
      message: "Success to create cars data",
      isSuccess: true,
      data: { ...newCar, image: newImages },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Failed to create cars data",
      isSuccess: false,
      error: error.message,
    });
  }
}

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  deleteCarById,
  updateCar,
};
