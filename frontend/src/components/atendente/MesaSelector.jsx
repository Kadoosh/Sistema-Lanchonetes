import { useState } from 'react';

export function MesaSelector({ mesas, mesaSelecionada, onSelect, isLoading }) {
  const [aberto, setAberto] = useState(false);

  if (isLoading) {
    return (
      <div className="px-4 py-2">
        <button className="w-full py-3 bg-white/20 rounded-xl text-white animate-pulse">
          Carregando mesas...
        </button>
      </div>
    );
  }

  const mesasLivres = mesas?.filter((m) => m.status === 'livre') || [];
  const mesasOcupadas = mesas?.filter((m) => m.status === 'ocupada') || [];
  const mesaSelecionadaObj = mesas?.find((m) => m.id === mesaSelecionada);

  return (
    <div className="px-4 py-2">
      {/* Botão de seleção */}
      <button
        onClick={() => setAberto(true)}
        className={`w-full py-4 px-5 rounded-xl font-semibold text-lg transition-all flex items-center justify-between ${
          mesaSelecionada
            ? 'bg-white text-primary-700 shadow-lg'
            : 'bg-white/20 text-white hover:bg-white/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍽️</span>
          {mesaSelecionada ? (
            <span>Mesa {mesaSelecionadaObj?.numero}</span>
          ) : (
            <span>Selecionar Mesa</span>
          )}
        </div>
        <span className="text-xl">▼</span>
      </button>

      {/* Modal de seleção em lista */}
      {aberto && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
          <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary-600 text-white rounded-t-2xl sm:rounded-t-2xl">
              <h2 className="text-xl font-bold">Selecionar Mesa</h2>
              <button
                onClick={() => setAberto(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Lista de Mesas */}
            <div className="flex-1 overflow-y-auto p-2">
              {/* Mesas Livres */}
              {mesasLivres.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                    🟢 Mesas Livres ({mesasLivres.length})
                  </p>
                  <div className="space-y-1">
                    {mesasLivres.map((mesa) => (
                      <button
                        key={mesa.id}
                        onClick={() => {
                          onSelect(mesa.id);
                          setAberto(false);
                        }}
                        className={`w-full p-4 rounded-xl flex items-center justify-between transition-all active:scale-[0.98] ${
                          mesaSelecionada === mesa.id
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-green-50 hover:bg-green-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${
                            mesaSelecionada === mesa.id
                              ? 'bg-white/20 text-white'
                              : 'bg-green-200 text-green-700'
                          }`}>
                            {mesa.numero}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-lg">Mesa {mesa.numero}</p>
                            <p className={`text-sm ${mesaSelecionada === mesa.id ? 'text-white/80' : 'text-gray-500'}`}>
                              {mesa.capacidade} lugares • {mesa.localizacao || 'Salão'}
                            </p>
                          </div>
                        </div>
                        {mesaSelecionada === mesa.id && (
                          <span className="text-2xl">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mesas Ocupadas */}
              {mesasOcupadas.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                    🔴 Mesas Ocupadas ({mesasOcupadas.length})
                  </p>
                  <div className="space-y-1">
                    {mesasOcupadas.map((mesa) => (
                      <div
                        key={mesa.id}
                        className="w-full p-4 rounded-xl flex items-center gap-4 bg-gray-100 opacity-50"
                      >
                        <div className="w-14 h-14 rounded-xl bg-red-200 flex items-center justify-center text-xl font-bold text-red-400">
                          {mesa.numero}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-lg text-gray-400">Mesa {mesa.numero}</p>
                          <p className="text-sm text-gray-400">
                            {mesa.capacidade} lugares • Ocupada
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mesasLivres.length === 0 && mesasOcupadas.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  <span className="text-4xl block mb-2">🪑</span>
                  Nenhuma mesa cadastrada
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => setAberto(false)}
                className="w-full py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
