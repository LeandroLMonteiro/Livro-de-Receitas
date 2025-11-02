// src/pages/CadastroReceita.tsx

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import axios from 'axios';
import { FichaTecnicaForm } from '../components/FichaTecnicaForm';
import { useNavigate } from 'react-router-dom'; 

// Adicionar Tailwind CSS classes para os estilos (precisa instalar e configurar o Tailwind)
// Exemplo: npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p

interface ReceitaFormData {
  titulo: string;
  modoDeFazer: string;
  categoria: string;
  // Foto e Tabela Nutricional seriam adicionados aqui
  itensFichaTecnica: any[];
}

export const CadastroReceita: React.FC = () => {
  const methods = useForm<ReceitaFormData>({
    defaultValues: {
      titulo: '',
      modoDeFazer: '',
      categoria: 'Principal',
      itensFichaTecnica: [], // Começa vazio
    }
  });
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = methods;
  const API_URL = (import.meta as any).env?.VITE_API_URL;
  const navigate = useNavigate(); // Usado para redirecionar após o sucesso
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data: ReceitaFormData) => {
    setErrorMsg('');
    if (data.itensFichaTecnica.length === 0) {
      setErrorMsg('Adicione pelo menos um ingrediente à Ficha Técnica.');
      return;
    }
    
    try {
      // Envia os dados para a rota POST /receitas do NestJS
      await axios.post(`${API_URL}/receitas`, data);
      alert('Receita cadastrada com sucesso!');
      // Redireciona para a listagem ou visualização
      navigate('/'); 
    } catch (error: any) {
      console.error("Erro ao cadastrar:", error.response?.data || error.message);
      setErrorMsg(`Erro no cadastro: ${error.response?.data?.message || 'Verifique o console.'}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Cadastro de Receita</h1>

      {/* Fornece o contexto do formulário para os componentes filhos */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Dados Principais da Receita */}
          <div className="p-4 border rounded-lg bg-white shadow">
            <h2 className="text-xl font-semibold mb-3">Informações Gerais</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input
                {...register("titulo", { required: "O título é obrigatório" })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {errors.titulo && <span className="text-red-500 text-sm">{errors.titulo.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mt-3">Categoria</label>
              <input
                {...register("categoria", { required: "A categoria é obrigatória" })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {errors.categoria && <span className="text-red-500 text-sm">{errors.categoria.message}</span>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-3">Modo de Fazer</label>
              <textarea
                {...register("modoDeFazer", { required: "O modo de fazer é obrigatório" })}
                rows={5}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {errors.modoDeFazer && <span className="text-red-500 text-sm">{errors.modoDeFazer.message}</span>}
            </div>
          </div>
          
          {/* Componente da Ficha Técnica */}
          <FichaTecnicaForm />
          
          {/* Mensagem de Erro Geral */}
          {errorMsg && <p className="text-red-600 font-medium">{errorMsg}</p>}

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition duration-150 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Salvando...' : 'Cadastrar Receita e Ficha Técnica'}
          </button>
          
        </form>
      </FormProvider>
    </div>
  );
};

export default CadastroReceita;
