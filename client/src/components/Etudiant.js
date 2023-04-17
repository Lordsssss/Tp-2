import React from "react";
import Axios from "axios";
import { useState, useEffect } from "react";

import "./css/Cours.css";

function Etudiant() {

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [listeEtudiant, setListeEtudiant] = useState([]);
  const URL = "http://192.168.56.1:3001";
  const [etudiantId, setEtudiantId] = useState("");
  const [coursId, setCoursId] = useState("");

  useEffect(() => {
    Axios.get(URL+"/Etudiant/AfficherListeEtudiants")
      .then((response) => {
        setListeEtudiant(response.data.listeEtudiants);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await Axios.post(
        URL+"/Etudiant/AjouterEtudiant",
        {
          nom,
          prenom,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data); 
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAjouterCours = async (event) => {
    event.preventDefault();

    try {
      const response = await Axios.post(
        URL+"/Etudiant/AjouterCours",
        {
          etudiantId,
          coursId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteEtudiant = async (id) => {
    try {
      await Axios.delete(URL+"/Etudiant/SupprimerEtudiant", {
        data: { etudiantId: id },
      });
      setListeEtudiant(listeEtudiant.filter((etudiant) => etudiant._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="Cours">
      <ul>
        {listeEtudiant.map((etudiant) => (
          <li key={etudiant._id} className="cours__elements">
            <div className="cours__text">{etudiant.prenom} {etudiant.nom}</div>
            <div className="cours__id">{etudiant._id}</div>
            <h4>Liste de Cours</h4>
            <ul>
              {etudiant.listeCours.map((cours) => (
                <li key={cours}>{cours}</li>
              ))}
            </ul>
            <button
              className="btn btn-outline-danger"
              onClick={() => onDeleteEtudiant(etudiant._id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-trash"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path
                  fillRule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <div className="cours__formGroup">
      <form onSubmit={handleSubmit} className="cours__form">
        <label>
          Nom:
          <input
            className="input"
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </label>
        <br />
        <label>
          Prénom:
          <input
            className="input"
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </label>
        <br />
        <button className="btn" type="submit">
          Créer Étudiant
        </button>
      </form>
      <form onSubmit={handleAjouterCours} className="cours__form">
        <label>
          L'Id de l'Étudiant:
          <input
            className="input"
            type="text"
            value={etudiantId}
            onChange={(e) => setEtudiantId(e.target.value)}
          />
        </label>
        <br />
        <label>
          L'Id du cours:
          <input
            className="input"
            type="text"
            value={coursId}
            onChange={(e) => setCoursId(e.target.value)}
          />
        </label>
        <br />
        <button className="btn" type="submit">
          Ajouter un Cours
        </button>
      </form>
      </div>
    </div>
  );
}

export default Etudiant;
