import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';
import { FaTrash, FaFileDownload, FaPlus, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'groceries',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'groceries',
    'rent',
    'utilities',
    'entertainment',
    'transportation',
    'health',
    'education',
    'shopping',
    'other'
  ];

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      // Token kontrolü
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      }

      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL);
      console.log('Giderler yanıtı:', response.data);
      const expenseData = response.data.expenses || response.data.expense || response.data || [];
      setExpenses(Array.isArray(expenseData) ? expenseData : []);
    } catch (error) {
      console.error('Giderler yüklenirken hata:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        // Kullanıcıyı login sayfasına yönlendir
        window.location.href = '/login';
      } else if (error.response?.status === 500) {
        toast.error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
      } else if (!error.response) {
        toast.error('Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.');
      } else {
        toast.error(error.response?.data?.message || 'Giderler yüklenirken hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Token kontrolü
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      }

      // Veri kontrolü
      if (!newExpense.title || !newExpense.amount || !newExpense.category) {
        toast.error('Lütfen tüm zorunlu alanları doldurun.');
        return;
      }

      console.log('Gönderilen veri:', newExpense);
      const response = await axiosInstance.post(API_PATHS.EXPENSE.CREATE, newExpense);
      console.log('Yeni gider yanıtı:', response.data);
      
      if (response.data.success || response.data.expense || response.status === 200) {
        toast.success('Gider başarıyla eklendi');
        setNewExpense({
          title: '',
          amount: '',
          category: 'groceries',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
        setIsFormOpen(false);
        await fetchExpenses(); // Listeyi hemen güncelle
      } else {
        throw new Error('Gider eklenemedi');
      }
    } catch (error) {
      console.error('Gider eklenirken hata:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 401) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        window.location.href = '/login';
      } else if (error.response?.status === 500) {
        toast.error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
      } else if (!error.response) {
        toast.error('Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.');
      } else {
        toast.error(error.response?.data?.message || 'Gider eklenirken hata oluştu');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE(id));
      toast.success('Gider başarıyla silindi');
      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gider silinirken hata oluştu');
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expenses.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error('Excel dosyası indirilirken hata oluştu');
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gider Yönetimi</h1>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadExcel}
            className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <FaFileDownload className="mr-2" />
            <span>Excel'e Aktar</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            <span>Yeni Gider Ekle</span>
          </motion.button>
        </div>
      </div>

      {/* Expense List */}
      <div className="grid gap-6">
        <AnimatePresence>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full"
              />
            </div>
          ) : (
            expenses.map((expense, index) => (
              <motion.div
                key={expense._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">{expense.title}</h3>
                    <p className="text-gray-600">{expense.description}</p>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                        {expense.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(expense.date).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-red-600">
                      ₺{Number(expense.amount).toLocaleString('tr-TR')}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(expense._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Yeni Gider Ekle</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaTimes />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                  <input
                    type="text"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Miktar (₺)</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarih</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="3"
                  />
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    İptal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Kaydet
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Expense;
