import './css/App.css';
import Cours from './components/Cours.js'
import Prof from './components/Prof';
import Etudiant from './components/Etudiant.js'
function App() {
  return (
    <div className="App">
      <h1>Liste des Cours</h1>
      <Cours/>
      <h1>Liste des Profs</h1>
      <Prof/>
      <h1>Liste des Étudiants</h1>
      <Etudiant/>
    </div>
  );
}

export default App;
