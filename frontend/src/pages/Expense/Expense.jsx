import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaCalendarAlt, FaTag, FaPlus, FaChartPie } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Expense = () => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    icon: '🛒'
  });

  const categories = [
    { value: 'market', label: 'Market', icon: '🛒' },
    { value: 'fatura', label: 'Faturalar', icon: '📄' },
    { value: 'ulasim', label: 'Ulaşım', icon: '🚌' },
    { value: 'saglik', label: 'Sağlık', icon: '🏥' },
    { value: 'egitim', label: 'Eğitim', icon: '📚' },
    { value: 'eglence', label: 'Eğlence', icon: '🎮' },
    { value: 'giyim', label: 'Giyim', icon: '👕' },
    { value: 'diger', label: 'Diğer', icon: '📦' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(API_PATHS.EXPENSE.CREATE, formData);
      toast.success('Gider başarıyla eklendi!');
      setFormData({
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        icon: '🛒'
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bir hata oluştu');
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'category') {
      const selectedCategory = categories.find(cat => cat.value === e.target.value);
      setFormData({
        ...formData,
        category: e.target.value,
        icon: selectedCategory ? selectedCategory.icon : '🛒'
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-rose-800 mb-8 text-center">
          Yeni Gider Ekle
        </h1>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kategori */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <FaChartPie className="mr-2 text-rose-600" />
                Kategori
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition duration-200"
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Miktar */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <FaShoppingBag className="mr-2 text-rose-600" />
                Miktar
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition duration-200"
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                />
                <span className="absolute right-4 top-3 text-gray-500">₺</span>
              </div>
            </div>

            {/* Tarih */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <FaCalendarAlt className="mr-2 text-rose-600" />
                Tarih
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition duration-200"
                required
              />
            </div>

            {/* Not */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <FaTag className="mr-2 text-rose-600" />
                Not (Opsiyonel)
              </label>
              <input
                type="text"
                name="note"
                value={formData.note || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-transparent transition duration-200"
                placeholder="Gider hakkında not ekleyin"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-rose-700 hover:to-orange-600 transition duration-200 shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaPlus />
            <span>Gider Ekle</span>
          </motion.button>
        </motion.form>

        {/* Bütçe İpuçları */}
        <motion.div
          className="mt-8 bg-white rounded-xl p-6 shadow-lg border-l-4 border-rose-500"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-rose-800 mb-3">
            💡 Bütçe İpuçları
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Giderlerinizi doğru kategorilere ayırın</li>
            <li>• Önemli harcamalarınızı not olarak ekleyin</li>
            <li>• Düzenli giderlerinizi takip edin</li>
            <li>• Ay sonunda kategori bazlı analiz yapın</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Expense;