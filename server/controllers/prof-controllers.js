const Prof = require("../models/prof");
const Cours = require("../models/cours");
const HttpErreur = require("../models/HttpErreur");

const afficherProfById = async (requete, reponse, next) => {
  const profId = requete.body.profId;
  let prof;
  try {
    prof = await Prof.findById(profId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération de la prof", 500)
    );
  }
  if (!prof) {
    return next(new HttpErreur("Aucune prof trouvée pour l'id fourni", 404));
  }
  reponse.json({ prof: prof.toObject({ getters: true }) });
};

const afficherListeProfs = async (requete, reponse, next) => {
  let listeProfs;
  try {
    listeProfs = await Prof.find();
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération de la liste des profs", 500)
    );
  }
  if (!listeProfs) {
    return next(new HttpErreur("Aucun prof trouvé", 404));
  }
  reponse.json({ listeProfs: listeProfs.map((prof) => prof.toObject({ getters: true })) });
};

const creerProf = async (requete, reponse, next) => {
  const { nom, prenom } = requete.body;

  let profExiste;

  try {
    profExiste = await Prof.findOne({ nom: nom, prenom: prenom });
  } catch {
    return next(new HttpErreur("Échec vérification utilisateur existe", 500));
  }

  if (profExiste) {
    return next(
      new HttpErreur("Utilisateur existe déjà, veuillez vos connecter", 422)
    );
  }

  let nouveauProf = new Prof({
    nom,
    prenom,
    listeCours: [],
  });
  try {
    await nouveauProf.save();
  } catch (err) {
    console.log(err);
    return next(new HttpErreur("Erreur lors de l'ajout de l'utilisateur", 422));
  }
  reponse.status(201).json({ Prof: nouveauProf.toObject({ getter: true }) });
};

const supprimerProf = async (requete, reponse, next) => {
  const profId = requete.body.profId;
  let prof;
  try {
    prof = await Prof.findByIdAndRemove(profId);
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression de la place", 500)
    );
  }

  reponse.status(200).json({ message: "Prof supprimée" });
};

const updateProf = async (requete, reponse, next) => {
  const { nom, prenom } = requete.body;
  console.log(requete.params.profId);
  const profId = requete.query.profId;

  let prof;

  try {
    prof = await Prof.findById(profId);
    prof.nom = nom;
    prof.prenom = prenom;
    await prof.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour de la place", 500)
    );
  }

  reponse.status(200).json({ Prof: prof.toObject({ getters: true }) });
};

const ajouterCoursProf = async (req, res, next) => {
  const { profId, coursId } = req.body;

  let prof;
  let cours;

  try {
    prof = await Prof.findById(profId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération du professeur", 500)
    );
  }

  if (!prof) {
    return next(
      new HttpErreur("Aucun professeur trouvé pour l'ID fourni", 404)
    );
  }

  try {
    cours = await Cours.findById(coursId);
  } catch (err) {
    return next(new HttpErreur("Erreur lors de la récupération du cours", 500));
  }

  if (!cours) {
    return next(new HttpErreur("Aucun cours trouvé pour l'ID fourni", 404));
  }

  const oldProfId = cours.prof;

  try {
    
    if (oldProfId) {
      const oldProf = await Prof.findById(oldProfId);
      oldProf.listeCours.pull(cours);
      await oldProf.save();
    }

    prof.listeCours.push(cours);
    cours.prof = prof;

    await prof.save({  });
    await cours.save({  });

  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de l'ajout du cours au professeur", 500)
    );
  }

  res.json({ message: "Le cours a été ajouté au professeur avec succès" });
};

exports.creerProf = creerProf;
exports.afficherProfById = afficherProfById;
exports.supprimerProf = supprimerProf;
exports.updateProf = updateProf;
exports.ajouterCoursProf = ajouterCoursProf;
exports.afficherListeProfs = afficherListeProfs;