const express = require("express");
const controllersProf = require("../controllers/prof-controllers");
const router = express.Router();

router.post("/AjouterProf", controllersProf.creerProf);
  
router.get("/AfficherProf", controllersProf.afficherProfById);
  
router.get("/AfficherListeProf", controllersProf.afficherListeProfs);
  
router.post("/ModifierProf",controllersProf.updateProf);
  
router.delete("/SupprimerProf",controllersProf.supprimerProf);

module.exports = router;
