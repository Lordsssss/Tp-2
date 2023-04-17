const Etudiant = require("../models/etudiant");
const Cours = require("../models/cours");
const HttpErreur = require("../models/HttpErreur");

const afficherEtudiantById = async (requete, reponse, next) => {
  const etudiantId = requete.body.etudiantId;
  let etudiant;
  try {
    etudiant = await Etudiant.findById(etudiantId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération de la etudiant", 500)
    );
  }
  if (!etudiant) {
    return next(
      new HttpErreur("Aucune etudiant trouvée pour l'id fourni", 404)
    );
  }
  reponse.json({ etudiant: etudiant.toObject({ getters: true }) });
};

const afficherListeEtudiants = async (requete, reponse, next) => {
  let listeEtudiants;
  try {
    listeEtudiants = await Etudiant.find();
  } catch (err) {
    return next(
      new HttpErreur(
        "Erreur lors de la récupération de la liste des profs",
        500
      )
    );
  }
  if (!listeEtudiants) {
    return next(new HttpErreur("Aucun prof trouvé", 404));
  }
  reponse.json({
    listeEtudiants: listeEtudiants.map((etudiant) =>
      etudiant.toObject({ getters: true })
    ),
  });
};

const creerEtudiant = async (requete, reponse, next) => {
  const { nom, prenom } = requete.body;

  let etudiantExiste;

  try {
    etudiantExiste = await Etudiant.findOne({ nom: nom, prenom: prenom });
  } catch {
    return next(new HttpErreur("Échec vérification utilisateur existe", 500));
  }

  if (etudiantExiste) {
    return next(
      new HttpErreur("Utilisateur existe déjà, veuillez vos connecter", 422)
    );
  }

  let nouveauEtudiant = new Etudiant({
    nom,
    prenom,
    listeCours: [],
  });
  try {
    await nouveauEtudiant.save();
  } catch (err) {
    console.log(err);
    return next(new HttpErreur("Erreur lors de l'ajout de l'utilisateur", 422));
  }
  reponse
    .status(201)
    .json({ Etudiant: nouveauEtudiant.toObject({ getter: true }) });
};

const supprimerEtudiant = async (requete, reponse, next) => {
  const etudiantId = requete.body.etudiantId;
  let etudiant;
  try {
    etudiant = await Etudiant.findById(etudiantId).populate('listeCours');
    if (!etudiant) {
      throw new Error("Etudiant non trouvé");
    }
    await Promise.all(
      etudiant.listeCours.map(async (cours) => {
        cours.listeEtudiants.pull(etudiant._id);
        await cours.save();
      })
    );
    await Etudiant.findByIdAndRemove(etudiantId);
  } catch (error) {
    return next(
      new HttpErreur("Erreur lors de la suppression de l'étudiant", 500)
    );
  }

  reponse.status(200).json({ message: "Etudiant supprimé" });
};

const updateEtudiant = async (requete, reponse, next) => {
  const { nom, prenom } = requete.body;
  const etudiantId = requete.query.etudiantId;

  let etudiant;

  try {
    etudiant = await Etudiant.findById(etudiantId);
    etudiant.nom = nom;
    etudiant.prenom = prenom;
    await etudiant.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour de la place", 500)
    );
  }

  reponse.status(200).json({ Etudiant: etudiant.toObject({ getters: true }) });
};

const ajouterCoursEtudiant = async (req, res, next) => {
  const { etudiantId, coursId } = req.body;

  let etudiant;
  let cours;

  try {
    etudiant = await Etudiant.findById(etudiantId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération du professeur", 500)
    );
  }

  if (!etudiant) {
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
  try {
    etudiant.listeCours.push(cours);
    cours.listeEtudiants.push(etudiant);

    await etudiant.save({});
    await cours.save({});
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de l'ajout du cours au professeur", 500)
    );
  }

  res.json({ message: "Le cours a été ajouté au professeur avec succès" });
};

exports.creerEtudiant = creerEtudiant;
exports.afficherEtudiantById = afficherEtudiantById;
exports.supprimerEtudiant = supprimerEtudiant;
exports.updateEtudiant = updateEtudiant;
exports.ajouterCoursEtudiant = ajouterCoursEtudiant;
exports.afficherListeEtudiants = afficherListeEtudiants;
