// src/App.tsx

import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CadastroReceita } from './pages/CadastroReceita';
import { VisualizacaoLivro } from './pages/VisualizacaoLivro';

const NavBar: React.FC = () => (
    <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-white text-xl font-bold">Receitas da The</Link>
            <div>
                <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Visualizar Livro</Link>
                <Link to="/cadastro" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium ml-4">Nova Receita</Link>
            </div>
        </div>
    </nav>
);

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Rota principal agora usa o VisualizacaoLivro */}
        <Route path="/" element={<VisualizacaoLivro />} /> 
        <Route path="/cadastro" element={<CadastroReceita />} />
      </Routes>
    </Router>
  );
}

export default App;