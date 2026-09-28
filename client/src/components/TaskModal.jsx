import React, { useState } from 'react';
import { ListPlus, X, Check } from 'lucide-react';

export const TaskModal = ({
  isOpen,
  onClose,
  tasks = [],
  onSaveTasks
}) => {
  const [inputText, setInputText] = useState(() => (tasks || []).join('\n'));

  React.useEffect(() => {
    if (isOpen) {
      setInputText((tasks || []).join('\n'));
    }
  }, [isOpen, tasks]);

  if (!isOpen) return null;

  const handleSave = () => {
    const list = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    onSaveTasks(list);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <ListPlus className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Gestionar Tareas y Enlaces</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-3">
          Pega una lista de enlaces (Linear, GitHub, Jira, Notion, Trello...) o títulos de historias (uno por línea). Toda la sala podrá ver y acceder a la tarea activa directamente desde la mesa.
        </p>

        <textarea
          rows={7}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`https://linear.app/team/issue/PROJ-101\nhttps://github.com/org/repo/issues/42\nhttps://company.atlassian.net/browse/PROJ-102\nDiseño de pasarela de pago`}
          className="w-full p-4 bg-slate-800 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5 resize-none leading-relaxed"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Lista</span>
          </button>
        </div>
      </div>
    </div>
  );
};
