const express = require("express");
const controllersCours = require("../controllers/cours-controllers");
const router = express.Router();

router.post("/AjouterCours", controllersCours.creerCours);
  
router.get("/AfficherCours", controllersCours.afficherCoursById);
  
router.get("/AfficherListeCours", controllersCours.afficherListeCours);
  
router.post("/ModifierCours",controllersCours.updateCours);
  
router.delete("/SupprimerCours",controllersCours.supprimerCours);

module.exports = router;