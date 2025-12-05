import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function PedidoCard({ pedido, onMarcarPronto }) {
  const [expandido, setExpandido] = useState(false);
  
  const tempoDecorrido = formatDistanceToNow(new Date(pedido.criadoEm), {
    locale: ptBR,
    addSuffix: true,
  });

  const totalItens = pedido.itens?.reduce((acc, item) => acc + item.quantidade, 0) || 0;

  return (
    <div className={`rounded-lg shadow-md overflow-hidden bg-white border-l-4 ${
      pedido.status === 'pronto' ? 'border-l-green-500' : 'border-l-orange-500'
    }`}>
      
      {/* Header compacto */}
      <div className={`px-3 py-2 ${pedido.status === 'pronto' ? 'bg-green-600' : 'bg-orange-500'} text-white flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="text-xl font-black">#{pedido.numero || pedido.id}</span>
          <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-bold">Mesa {pedido.mesa?.numero || '-'}</span>
        </div>
        <span className="text-xs opacity-90">⏱️ {tempoDecorrido}</span>
      </div>

      {/* Info Cliente/Atendente - linha única */}
      <div className="px-3 py-1.5 bg-gray-100 text-xs flex gap-4 border-b">
        {pedido.cliente && (
          <span className="text-gray-700">👤 <strong>{pedido.cliente.nome}</strong></span>
        )}
        {pedido.criadoPor && (
          <span className="text-gray-600">🧑‍💼 {pedido.criadoPor.nome}</span>
        )}
      </div>

      {/* Botão para expandir itens */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors border-b"
      >
        <span className="text-sm font-semibold text-gray-700">
          📋 {totalItens} {totalItens === 1 ? 'item' : 'itens'}
        </span>
        <span className={`text-gray-500 transition-transform ${expandido ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Itens - colapsável */}
      {expandido && (
        <div className="p-2 space-y-1 animate-slideDown">
          {pedido.itens?.map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-1.5 bg-gray-50 rounded border">
              <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded flex items-center justify-center font-bold text-sm">
                {item.quantidade}x
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">{item.produto?.nome || 'Item'}</p>
                {item.observacao && (
                  <p className="text-xs text-orange-600 truncate">⚠️ {item.observacao}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Observação geral */}
      {pedido.observacao && (
        <div className="mx-2 mb-2 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          📝 {pedido.observacao}
        </div>
      )}

      {/* Botão */}
      {pedido.status === 'preparando' && (
        <div className="p-2 border-t">
          <button
            onClick={() => onMarcarPronto(pedido.id)}
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-sm transition-all active:scale-[0.98]"
          >
            ✅ PRONTO
          </button>
        </div>
      )}
    </div>
  );
}
