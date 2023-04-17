import React from "react";
import Axios from "axios";
import { useState, useEffect } from "react";
import "./css/Cours.css";

function Cours() {
  const [titre, setTitre] = useState("");
  const [profId, setProfId] = useState("");
  const [listeCours, setListeCours] = useState([]);
  const URL = "http://192.168.56.1:3001";
  useEffect(() => {
    Axios.get(URL+"/Cours/AfficherListeCours")
      .then((response) => {
        setListeCours(response.data.listeCours);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onDeleteCours = async (id) => {
    try {
      await Axios.delete(URL+"/Cours/SupprimerCours", {
        data: { coursId: id },
      });
      setListeCours(listeCours.filter((cours) => cours._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (event) => {
    try {
      const response = await Axios.post(
        URL+"/Cours/AjouterCours",
        {
          titre,
          profId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    window.location.reload();
  };
  return (
    <div className="Cours">
      <ul>
        
        {listeCours.map((cours) => (
          <li key={cours._id} className="cours__elements">
            <div className="cours__text">{cours.titre}</div>
            <div className="cours__id">{cours._id}</div>
            <div className="cours__text">Id prof :</div>
            <div className="cours__id">{cours.prof}</div>
            <div className="cours__text">Liste Étudiant :</div>
            <ul>
              {cours.listeEtudiants.map((etudiant) => (
                <li key={etudiant}>{etudiant}</li>
              ))}
            </ul>
            <button
              className="btn-outline-danger"
              onClick={() => onDeleteCours(cours._id)}
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
      <form onSubmit={handleSubmit} className="cours__form">
        <label>
          Titre:
          <input
            className="input"
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
          />
        </label>
        <br />
        <label>
          L'Id du proffesseur:
          <input
            className="input"
            type="text"
            value={profId}
            onChange={(e) => setProfId(e.target.value)}
          />
        </label>
        <br />
        <button className="btn" type="submit">
          Créer Cours
        </button>
      </form>
    </div>
  );
}

export default Cours;
