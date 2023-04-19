const Prof = require("../models/prof");
const Cours = require("../models/cours");
const HttpErreur = require("../models/HttpErreur");
const etudiant = require("../models/etudiant");

const afficherCoursById = async (requete, reponse, next) => {
  const coursId = requete.body.coursId;
  let cours;
  try {
    cours = await Cours.findById(coursId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération de la prof", 500)
    );
  }
  if (!cours) {
    return next(new HttpErreur("Aucune prof trouvée pour l'id fourni", 404));
  }
  reponse.json({ cours: cours.toObject({ getters: true }) });
};

const afficherListeCours = async (requete, reponse, next) => {
  let listeCours;
  try {
    listeCours = await Cours.find();
  } catch (err) {
    return next(
      new HttpErreur(
        "Erreur lors de la récupération de la liste des profs",
        500
      )
    );
  }
  if (!listeCours) {
    return next(new HttpErreur("Aucun prof trouvé", 404));
  }
  reponse.json({
    listeCours: listeCours.map((cours) => cours.toObject({ getters: true })),
  });
};

const creerCours = async (requete, reponse, next) => {
  const { titre, profId } = requete.body;

  let prof;
  try {
    prof = await Prof.findById(profId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération du professeur", 500)
    );
  }

  if (!prof) {
    return next(
      new HttpErreur("Aucun professeur trouvé pour l'id fourni", 404)
    );
  }
  const nouveauCours = new Cours({
    titre,
    prof,
  });
  try {
    await nouveauCours.save({});
    prof.listeCours.push(nouveauCours);
    await prof.save({});
  } catch (err) {
    return next(new HttpErreur("Erreur lors de la création du cours", 500));
  }
  try{
    // Erreur de récursivité lors de la première création d'un cours pour un prof
    // reponse.status(200).json({ cours: nouveauCours.toObject({ getters: true }) });
    reponse.status(200).json("Le prof a été bien créer");
  }catch(err){
    console.log(err);
  }
};

const supprimerCours = async (requete, reponse, next) => {
  const coursId = requete.body.coursId;
  let cours;
  try {
    cours = await Cours.findById(coursId).populate('listeEtudiants');
    if (!cours) {
      throw new Error('Etudiant non trouvé');
    }
    await Promise.all(cours.listeEtudiants.map(async (etudiant) => {
      console.log(etudiant)
      etudiant.listeCours.pull(cours._id);
      await etudiant.save();

    }));
    await Cours.findByIdAndRemove(coursId);
  } catch {
    return next(new HttpErreur("Erreur lors de la suppression du cours", 500));
  }
  

  const teacherId = cours.prof;
  let teacher;
  try {
    teacher = await Prof.findById(teacherId);
    teacher.listeCours = teacher.listeCours.filter(
      (c) => c.toString() !== coursId.toString()
    );
    await teacher.save();
  } catch {
    return next(
      new HttpErreur(
        "Erreur lors de la mise à jour de la liste de cours du prof",
        500
      )
    );
  }

  reponse.status(200).json({ message: "Cours supprimé" });
};

const updateCours = async (requete, reponse, next) => {
  const { titre, profId } = requete.body;
  const coursId = requete.query.coursId;

  let cours;
  let prof;
  try {
    cours = await Cours.findById(coursId);
    const oldProfId = cours.prof;
    const oldProf = await Prof.findById(oldProfId);
    oldProf.listeCours.pull(cours);
    await oldProf.save();
  } catch {
    return next(
      new HttpErreur(
        "Erreur lors de la mise à jour de la liste de cours du prof",
        500
      )
    );
  }
  try {
    cours.titre = titre;
    prof = await Prof.findById(profId);
    cours.prof = prof;
    prof.listeCours.push(cours);
    await prof.save();
    await cours.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour de la place", 500)
    );
  }
  reponse.status(200).json({ cours: cours.toObject({ getters: true }) });
};


exports.creerCours = creerCours;
exports.afficherCoursById = afficherCoursById;
exports.supprimerCours = supprimerCours;
exports.updateCours = updateCours;
exports.afficherListeCours = afficherListeCours;
