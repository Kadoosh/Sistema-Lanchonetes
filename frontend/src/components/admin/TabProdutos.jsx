import { useState } from 'react';
import { useProdutos, useCategorias } from '../../hooks/useProdutos';
import { useAdmin } from '../../hooks/useAdmin';
import { Modal } from '../common/Modal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { FeedbackModal } from '../common/FeedbackModal';
import { uploadImagem } from '../../services/api';

export function TabProdutos() {
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, nome: '' });
  const [feedback, setFeedback] = useState({ open: false, type: 'success', title: '', message: '' });

  const { data: produtosData } = useProdutos({ busca: busca || undefined });
  const { data: categoriasData } = useCategorias();
  const { criarProduto, atualizarProduto, deletarProduto } = useAdmin();

  const produtos = produtosData?.data || [];
  const categorias = categoriasData?.data || [];

  const handleNovo = () => {
    setProdutoEditando(null);
    setModalAberto(true);
  };

  const handleEditar = (produto) => {
    setProdutoEditando(produto);
    setModalAberto(true);
  };

  const handleDeletar = (produto) => {
    setDeleteModal({ open: true, id: produto.id, nome: produto.nome });
  };

  const confirmarDelete = async () => {
    try {
      await deletarProduto.mutateAsync(deleteModal.id);
      setDeleteModal({ open: false, id: null, nome: '' });
      setFeedback({ open: true, type: 'success', title: 'Sucesso!', message: 'Produto excluído com sucesso!' });
    } catch (error) {
      setFeedback({ open: true, type: 'error', title: 'Erro!', message: error.response?.data?.message || error.message });
    }
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(preco);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <button
          onClick={handleNovo}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
        >
          + Novo Produto
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Produto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Categoria
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {produtos.map((produto) => (
              <tr key={produto.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {produto.imagem ? (
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xl">
                        🍽️
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{produto.nome}</div>
                      {produto.descricao && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{produto.descricao}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {produto.categoria?.nome || '-'}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {formatarPreco(produto.preco)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      produto.disponivel
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {produto.disponivel ? 'Disponível' : 'Indisponível'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm space-x-2">
                  <button
                    onClick={() => handleEditar(produto)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeletar(produto)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Form */}
      <ProdutoFormModal
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setProdutoEditando(null);
        }}
        produto={produtoEditando}
        categorias={categorias}
        onSave={async (dados) => {
          try {
            if (produtoEditando) {
              await atualizarProduto.mutateAsync({ id: produtoEditando.id, dados });
            } else {
              await criarProduto.mutateAsync(dados);
            }
            setModalAberto(false);
            setProdutoEditando(null);
            setFeedback({ open: true, type: 'success', title: 'Sucesso!', message: 'Produto salvo com sucesso!' });
          } catch (error) {
            setFeedback({ open: true, type: 'error', title: 'Erro!', message: error.response?.data?.message || error.message });
          }
        }}
      />

      {/* Modal de Delete */}
      <DeleteConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, nome: '' })}
        onConfirm={confirmarDelete}
        itemName={deleteModal.nome}
        isLoading={deletarProduto.isPending}
      />

      {/* Modal de Feedback */}
      <FeedbackModal
        isOpen={feedback.open}
        onClose={() => setFeedback({ ...feedback, open: false })}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
      />
    </div>
  );
}

// Modal de Formulário
function ProdutoFormModal({ isOpen, onClose, produto, categorias, onSave }) {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoriaId: '',
    disponivel: true,
    imagem: '',
  });
  const [previewImagem, setPreviewImagem] = useState('');
  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Resetar formulário quando modal abre/fecha ou produto muda
  useState(() => {
    if (produto) {
      setForm({
        nome: produto.nome || '',
        descricao: produto.descricao || '',
        preco: produto.preco || '',
        categoriaId: produto.categoriaId || '',
        disponivel: produto.disponivel ?? true,
        imagem: produto.imagem || '',
      });
      setPreviewImagem(produto.imagem || '');
      setArquivoImagem(null);
    } else {
      setForm({
        nome: '',
        descricao: '',
        preco: '',
        categoriaId: '',
        disponivel: true,
        imagem: '',
      });
      setPreviewImagem('');
      setArquivoImagem(null);
    }
  }, [produto]);

  // Selecionar arquivo de imagem
  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito grande. Máximo 5MB.');
        return;
      }
      
      // Guardar arquivo para upload
      setArquivoImagem(file);
      
      // Criar preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Limpar imagem
  const handleRemoverImagem = () => {
    setForm({ ...form, imagem: '' });
    setPreviewImagem('');
    setArquivoImagem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let imagemUrl = form.imagem;
    
    // Se tem arquivo novo, fazer upload
    if (arquivoImagem) {
      try {
        setUploading(true);
        const resultado = await uploadImagem(arquivoImagem);
        imagemUrl = resultado.url;
      } catch (error) {
        alert('Erro ao fazer upload da imagem: ' + (error.response?.data?.message || error.message));
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    
    onSave({
      ...form,
      preco: parseFloat(form.preco),
      categoriaId: form.categoriaId ? parseInt(form.categoriaId) : null,
      imagem: imagemUrl || null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={produto ? 'Editar Produto' : 'Novo Produto'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            type="text"
            required
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço *
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={form.preco}
            onChange={(e) => setForm({ ...form, preco: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            value={form.categoriaId}
            onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Sem categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Foto do Produto
          </label>
          <div className="space-y-2">
            {previewImagem ? (
              <div className="relative inline-block">
                <img
                  src={previewImagem}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoverImagem}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-sm font-bold"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                <span className="text-3xl">📷</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImagemChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <p className="text-xs text-gray-500">PNG, JPG, GIF ou WebP. Máximo 5MB.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="disponivel"
            checked={form.disponivel}
            onChange={(e) => setForm({ ...form, disponivel: e.target.checked })}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <label htmlFor="disponivel" className="text-sm font-medium text-gray-700">
            Produto disponível
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {uploading ? 'Enviando imagem...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
