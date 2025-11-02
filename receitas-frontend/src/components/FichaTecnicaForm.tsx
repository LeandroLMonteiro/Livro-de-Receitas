// src/components/FichaTecnicaForm.tsx

import React, { useState, useEffect } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';
import axios from 'axios';

// Interface que espelha os dados que o backend espera
interface IngredienteDB {
  id: string;
  nome: string;
  unidadePadrao: string;
}

// Interface que representa o formulário principal
interface ReceitaFormData {
  titulo: string;
  modoDeFazer: string;
  categoria: string;
  itensFichaTecnica: {
    ingredienteId: string;
    quantidadeBruta: number;
    unidadeDeMedida: string;
    fatorCorrecao: number;
    indiceCoccao: number;
    dadosComplementares?: string;
  }[];
}

export const FichaTecnicaForm: React.FC = () => {
  const { control, register, formState: { errors } } = useFormContext<ReceitaFormData>();
  
  // Hook para gerenciar arrays de campos (adicionar/remover linhas)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "itensFichaTecnica",
  });
  
  const API_URL = (import.meta as any).env?.VITE_API_URL ?? '';
  const [ingredientesDB, setIngredientesDB] = useState<IngredienteDB[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar a lista de ingredientes disponíveis do Backend
  useEffect(() => {
    axios.get<IngredienteDB[]>(`${API_URL}/ingredientes`)
      .then(response => {
        setIngredientesDB(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar ingredientes:", err);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) {
    return <p>Carregando ingredientes...</p>;
  }

  if (ingredientesDB.length === 0) {
    return <p className="text-red-500">
      ⚠️ Por favor, cadastre ingredientes básicos na API (/ingredientes) antes de criar uma ficha técnica.
    </p>;
  }

  // Helper para mostrar erros de validação
  const getError = (index: number, field: keyof ReceitaFormData['itensFichaTecnica'][0]) => {
    const error = (errors.itensFichaTecnica?.[index] as FieldErrors<any>)?.[field];

    if (!error) return null;

    // Se for uma string, renderiza direto; se for um objeto com `message`, usa message; caso contrário converte para string por segurança
    if (typeof error === 'string') {
      return <span className="text-red-500 text-xs">{error}</span>;
    }

    if (typeof error === 'object' && 'message' in error && error.message) {
      return <span className="text-red-500 text-xs">{String((error as any).message)}</span>;
    }

    // fallback seguro
    return <span className="text-red-500 text-xs">{String(error)}</span>;
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 mt-4">
      <h3 className="text-xl font-semibold mb-3">Ficha Técnica - Ingredientes</h3>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left text-xs font-medium">Ingrediente</th>
            <th className="p-2 text-center text-xs font-medium">Qtd. Bruta</th>
            <th className="p-2 text-center text-xs font-medium">Unidade</th>
            <th className="p-2 text-center text-xs font-medium">Fator Corr. (FC)</th>
            <th className="p-2 text-center text-xs font-medium">Índice Coc. (IC)</th>
            <th className="p-2 text-left text-xs font-medium">Dados Comp.</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {fields.map((field, index) => (
            <tr key={field.id}>
              {/* Ingrediente (Dropdown) */}
              <td className="p-2">
                <select
                  {...register(`itensFichaTecnica.${index}.ingredienteId`, { required: "Obrigatório" })}
                  className="w-full border rounded p-1 text-sm"
                  defaultValue={field.ingredienteId}
                >
                  <option value="">Selecione um Ingrediente</option>
                  {ingredientesDB.map((ing) => (
                    <option key={ing.id} value={ing.id}>{ing.nome}</option>
                  ))}
                </select>
                {getError(index, 'ingredienteId')}
              </td>

              {/* Quantidade Bruta */}
              <td className="p-2">
                <input
                  type="number"
                  step="0.01"
                  {...register(`itensFichaTecnica.${index}.quantidadeBruta`, { required: "Qtd.?", valueAsNumber: true })}
                  className="w-20 border rounded p-1 text-sm text-center"
                />
                {getError(index, 'quantidadeBruta')}
              </td>
              
              {/* Unidade de Medida */}
              <td className="p-2">
                <input
                  type="text"
                  {...register(`itensFichaTecnica.${index}.unidadeDeMedida`, { required: "Unid.?" })}
                  className="w-16 border rounded p-1 text-sm text-center"
                />
                {getError(index, 'unidadeDeMedida')}
              </td>

              {/* Fator de Correção (FC) */}
              <td className="p-2">
                <input
                  type="number"
                  step="0.01"
                  {...register(`itensFichaTecnica.${index}.fatorCorrecao`, { required: "FC?", valueAsNumber: true })}
                  className="w-16 border rounded p-1 text-sm text-center"
                />
                {getError(index, 'fatorCorrecao')}
              </td>

              {/* Índice de Cocção (IC) */}
              <td className="p-2">
                <input
                  type="number"
                  step="0.01"
                  {...register(`itensFichaTecnica.${index}.indiceCoccao`, { required: "IC?", valueAsNumber: true })}
                  className="w-16 border rounded p-1 text-sm text-center"
                />
                {getError(index, 'indiceCoccao')}
              </td>
              
              {/* Dados Complementares */}
              <td className="p-2">
                <input
                  type="text"
                  {...register(`itensFichaTecnica.${index}.dadosComplementares`)}
                  className="w-full border rounded p-1 text-sm"
                />
              </td>

              {/* Botão Remover */}
              <td className="p-2 text-center">
                <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700 text-xl font-bold">
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botão Adicionar Item */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => append({ 
            ingredienteId: '', 
            quantidadeBruta: 0, 
            unidadeDeMedida: '', 
            fatorCorrecao: 1.0, 
            indiceCoccao: 1.0 
          } as any)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          + Adicionar Ingrediente
        </button>
      </div>
    </div>
  );
};

export default FichaTecnicaForm;