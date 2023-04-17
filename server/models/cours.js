const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const coursSchema = new Schema({
    titre:{type: String, required: true},
    prof: { type: mongoose.Types.ObjectId, ref: 'Prof', required: true },
    listeEtudiants: [{ type: mongoose.Types.ObjectId, ref: 'Etudiant'}]
});

module.exports = mongoose.model("Cours", coursSchema);