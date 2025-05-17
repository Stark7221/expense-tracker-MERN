import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaCalendarAlt, FaTag, FaPlus } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const Income = () => {
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    icon: '💰'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(API_PATHS.INCOME.CREATE, formData);
      toast.success('Gelir başarıyla eklendi!');
      setFormData({
        source: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        icon: '💰'
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bir hata oluştu');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-indigo-800 mb-8 text-center">
          Yeni Gelir Ekle
        </h1>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gelir Kaynağı */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <FaTag className="mr-2 text-indigo-600" />
                Gelir Kaynağı
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
                placeholder="Örn: Maaş, Freelance, Yatırım"
                required
              />
            </div>

            {/* Miktar */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <FaMoneyBillWave className="mr-2 text-green-600" />
                Miktar
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
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
                <FaCalendarAlt className="mr-2 text-indigo-600" />
                Tarih
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
              />
            </div>

            {/* İkon */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                İkon
              </label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
              >
                <option value="💰">💰 Para</option>
                <option value="💵">💵 Nakit</option>
                <option value="💳">💳 Kart</option>
                <option value="🏦">🏦 Banka</option>
                <option value="💸">💸 Transfer</option>
              </select>
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:from-indigo-700 hover:to-blue-600 transition duration-200 shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaPlus />
            <span>Gelir Ekle</span>
          </motion.button>
        </motion.form>

        {/* İpuçları Kartı */}
        <motion.div
          className="mt-8 bg-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-indigo-800 mb-3">
            💡 İpuçları
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Düzenli gelirleri takip etmek için kaynak adını standart tutun</li>
            <li>• Gelir tarihini doğru girdiğinizden emin olun</li>
            <li>• Büyük miktarları kontrol ederek girin</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Income;