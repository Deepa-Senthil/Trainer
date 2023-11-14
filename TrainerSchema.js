const mongoose = require("mongoose")

const TrainerSchema = new mongoose.Schema({
    name: String,
    gender: String,
    email: String,
    phno: String,
    image: String

});
const Trainer = mongoose.model('Trainer', TrainerSchema);

module.exports = Trainer