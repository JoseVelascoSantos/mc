import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className='App-header d-flex flex-column'>
      <div className="container d-flex flex-column">
        <div className="header d-flex flex-column ">
          <h1>Métodos de clasificación</h1>
        </div>
        <div className="d-flex flex-column mt-3">
          <div className="d-flex flex-row align-items-center justify-content-center">
            <h5 className="d-flex flex-row ">
              Fichero <div className="ml-2">Iris2Clases.txt</div>:{" "}
            </h5>
            <input className="ml-5 mb-2" type="file" id="iris2clases" />
          </div>

          <div className="d-flex flex-row align-items-center justify-content-center">
            <h5 className="d-flex flex-row">Fichero de Ejemplo: </h5>
            <input className="ml-3 mb-2" type="file" id="testIris" />
          </div>

          <div className='mt-5 d-flex justify-content-center'>
            <button className="btn btn-primary m-2" id="startKMedias">Empezar K-Medias</button>
            <button className="btn btn-success m-2" id="startBayes">Empezar Bayes</button>
            <button className="btn btn-danger m-2" onClick="window.location.reload();">
              Recargar página </button>
          </div>
          <div id="resultado">

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
