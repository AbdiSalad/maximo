import logo from './mlogo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <p>
          Welcome to Maximo.
        </p> */}
        <a
          className="App-link"
          href="http://localhost:9000/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Welcome to maximo
        </a>
      </header>
    </div>
  );
}

export default App;
