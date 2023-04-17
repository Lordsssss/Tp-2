const express = require("express");
const controllersEtudiant = require("../controllers/etudiant-controllers");
const router = express.Router();

router.post("/AjouterEtudiant", controllersEtudiant.creerEtudiant);
  
router.get("/AfficherEtudiant", controllersEtudiant.afficherEtudiantById);
  
router.get("/AfficherListeEtudiants", controllersEtudiant.afficherListeEtudiants);
  
router.post("/ModifierEtudiant",controllersEtudiant.updateEtudiant);

router.post("/AjouterCours", controllersEtudiant.ajouterCoursEtudiant);

router.delete("/SupprimerEtudiant",controllersEtudiant.supprimerEtudiant);

module.exports = router;
