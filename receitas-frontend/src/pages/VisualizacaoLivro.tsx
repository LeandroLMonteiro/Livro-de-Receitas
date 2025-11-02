// src/pages/VisualizacaoLivro.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Interface de dados que vem do Backend (simplificada)
interface Receita {
    id: string;
    titulo: string;
    categoria: string;
    classificacaoEstrelas: number;
    modoDeFazer: string;
    fichaTecnica: any[]; // Itens detalhados
    comentarios: any[];
    fotoUrl?: string;
}

export const VisualizacaoLivro: React.FC = () => {
    const [receitas, setReceitas] = useState<Receita[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todos');
    
    const API_URL: string = (import.meta as any).env?.VITE_API_URL ?? '';
    useEffect(() => {
        // Busca todas as receitas e carrega suas relações (fichaTecnica, etc)
        axios.get<Receita[]>(`${API_URL}/receitas/completo`) // Rota completa a ser criada no backend
            .then(response => {
                setReceitas(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao carregar receitas:", err);
                setError(err?.message ?? String(err));
                setLoading(false);
            });
    }, [API_URL]);

    if (loading) {
        return <div className="p-6">Carregando livro de receitas...</div>;
    }

    if (error) return <div>Error: {error}</div>;
    if (!Array.isArray(receitas)) {
        console.error('Receitas não é um array:', receitas);
        return <div>Erro: formato de dados inválido</div>;
    }
    
    // Extrai categorias únicas para o índice
    const categorias = ['Todos', ...new Set(receitas.map(r => r.categoria))];
    
    // Filtra receitas
    const receitasFiltradas = categoriaSelecionada === 'Todos'
        ? receitas
        : receitas.filter(r => r.categoria === categoriaSelecionada);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Índice Lateral (Capa do Livro/Navegação) */}
            <div className="w-64 bg-white p-6 shadow-xl sticky top-0 h-screen overflow-y-auto">
                <h2 className="text-2xl font-serif text-gray-800 mb-6 border-b pb-2">Índice</h2>
                
                <ul className="space-y-2">
                    {categorias.map(cat => (
                        <li key={cat}>
                            <a
                                href={`#categoria-${cat}`}
                                onClick={() => setCategoriaSelecionada(cat)}
                                className={`block p-2 rounded transition duration-150 ${
                                    categoriaSelecionada === cat ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {cat}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Visualização da Receita (Páginas do Livro) */}
            <div className="flex-1 p-8">
                {receitasFiltradas.length === 0 && (
                    <div className="text-center p-20 bg-white rounded-lg shadow-lg">
                        <h3 className="text-xl text-gray-600">Nenhuma receita na categoria "{categoriaSelecionada}".</h3>
                        <Link to="/cadastro" className="text-blue-500 mt-2 block">Crie uma agora!</Link>
                    </div>
                )}
                
                {receitasFiltradas.map(receita => (
                    <div 
                        key={receita.id} 
                        id={`receita-${receita.id}`} 
                        className="bg-white p-8 mb-8 rounded-lg shadow-lg border-l-8 border-yellow-600"
                        style={{ minHeight: '400px' }} // Simula uma página
                    >
                        <h2 className="text-4xl font-serif text-yellow-800 border-b pb-2 mb-4">{receita.titulo}</h2>
                        <p className="text-sm text-gray-500 mb-4">Categoria: {receita.categoria}</p>
                        
                        {/* Exemplo de Ficha Técnica Detalhada */}
                        <div className="my-6">
                            <h3 className="text-xl font-bold mb-3 text-gray-700">Ingredientes (Ficha Técnica)</h3>
                            <ul className="list-disc list-inside ml-4 text-gray-600">
                                {receita.fichaTecnica.map((item, index) => (
                                    <li key={index} className="text-sm mb-1">
                                        {item.quantidadeBruta} {item.unidadeDeMedida} de **{item.ingrediente.nome}** (<span className="font-mono text-xs">FC: {item.fatorCorrecao} | QC: {item.quantidadeCalculada} {item.unidadeDeMedida} | Partic: {item.percentualParticipacao}%</span>)
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Modo de Fazer */}
                        <div className="my-6">
                            <h3 className="text-xl font-bold mb-3 text-gray-700">Modo de Fazer</h3>
                            <p className="whitespace-pre-wrap text-gray-700">{receita.modoDeFazer}</p>
                        </div>
                        
                        {/* Comentários (apenas para visualização) */}
                        <div className="mt-8 border-t pt-4">
                            <h3 className="text-lg font-semibold text-gray-700">Comentários ({receita.comentarios.length})</h3>
                            {/* Renderizar comentários... */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisualizacaoLivro;