const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer')

const app = express();
const port = 3000

const mongoose = require('mongoose');
const Trainer = require("./TrainerSchema")

mongoose.connect('mongodb://localhost:27017/local')
    .then(() => {
        console.log('Mongoose Connected successfully');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


    
app.use(cors({
    origin: "http://localhost:5173"
}))

app.use(express.json())

const globalErrorHandling = async (err, req, res, next) => {
    res.json(err.message)
    next();
}
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: fileStorageEngine });


app.post("/trainer", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    const trainer = await Trainer.create({
        name: req.body.name,
        gender: req.body.gender,
        email: req.body.email,
        phno: req.body.phno,
        image: req.file.filename
    });

    return res.status(200).json({ trainer });

    const imagepath = path.join(__dirname, "./Src/images", req.file.filename);
    res.sendFile(imagepath);
});

app.get("/trainer", async (req, res) => {
    const trainer = await Trainer.find()
    res.json({ trainer })
})

app.get("/trainer/images/:filename", async (req, res) => {
    const image = req.params.filename;
    const imagepath = path.join(__dirname, "images", image);
    res.sendFile(imagepath);
})

app.listen(port, (err) => {
    if (err) {

        console.error("Error starting the server:", err);
    } else {
        console.log("Server has started on port " + port);
    }
});