const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profSchema = new Schema({
    nom:{type: String, required: true},
    prenom:{type: String, required: true},
    listeCours:[{ type: mongoose.Types.ObjectId, ref: 'Cours'}]
});

module.exports = mongoose.model("Prof", profSchema);