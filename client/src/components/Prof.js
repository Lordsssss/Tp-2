import React from "react";
import Axios from "axios";
import { useState, useEffect } from "react";
import "./css/Cours.css";

function Prof() {
  const [listeProf, setListeProf] = useState([]);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [profId, setProfId] = useState("");
  const [coursId, setCoursId] = useState("");
  const [nouveauNom, setNouveauNom] = useState("");
  const [nouveauPrenom, setNouveauPrenonm] = useState("");
  const URL = "http://192.168.56.1:3001";


  useEffect(() => {
    Axios.get(URL + "/Prof/AfficherListeProf")
      .then((response) => {
        setListeProf(response.data.listeProfs);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await Axios.post(
        URL + "/Prof/AjouterProf",
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
      console.log(response.data); // Log the response data
      // Add any other logic to handle successful response
      window.location.reload();
    } catch (error) {
      console.error(error); // Log any errors
      // Add any other logic to handle errors
    }
  };

  const handleAjouterCours = async (event) => {
    event.preventDefault();

    try {
      const response = await Axios.post(
        URL + "/Prof/AjouterCours",
        {
          profId,
          coursId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data); // Log the response data
      // Add any other logic to handle successful response
      window.location.reload();
    } catch (error) {
      console.error(error); // Log any errors
      // Add any other logic to handle errors
    }
  };

  const onDeleteProf = async (id) => {
    try {
      await Axios.delete(URL + "/Prof/SupprimerProf", {
        data: { profId: id },
      });
      setListeProf(listeProf.filter((prof) => prof._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="Cours">
      <ul>
        {listeProf.map((prof) => (
          <li key={prof._id} className="cours__elements">
            <div className="cours__text">{prof.prenom} {prof.nom}</div>
            <div className="cours__id">{prof._id}</div>
            <h4>Liste de cours</h4>
            <div className="dropdown">
              <ul>
                {prof.listeCours.map((cours) => (
                  <li key={cours}>{cours}</li>
                ))}
              </ul>
            </div>
            <button
              className="btn btn-outline-danger"
              onClick={() => onDeleteProf(prof._id)}
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
            Créer Prof
          </button>
        </form>
        <form onSubmit={handleAjouterCours} className="cours__form">
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

export default Prof;
