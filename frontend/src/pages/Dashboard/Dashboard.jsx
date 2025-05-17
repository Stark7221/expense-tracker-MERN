import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { formatCurrency, formatDate } from '../../utils/helper';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FaWallet, FaShoppingCart, FaBalanceScale, FaSpinner } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    recentTransactions: [],
    monthlyData: {
      labels: [],
      incomes: [],
      expenses: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Token kontrolü
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      }

      // Tek bir API çağrısı ile tüm verileri alalım
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      console.log('API Yanıtı:', {
        endpoint: API_PATHS.DASHBOARD.GET_DATA,
        data: response.data,
        status: response.status
      });

      // Veri kontrolü
      if (!response.data) {
        throw new Error('Sunucudan veri alınamadı');
      }

      const mockData = {
        totalIncome: response.data.totalIncome || 0,
        totalExpense: response.data.totalExpense || 0,
        balance: response.data.totalBalance || 0,
        recentTransactions: response.data.lastTransactions || [],
        monthlyData: {
          labels: Object.keys(response.data.last60DaysIncomeTransactions || {}),
          incomes: Object.values(response.data.last60DaysIncomeTransactions || {}),
          expenses: Object.values(response.data.last30DaysExpenseTransactions || {})
        }
      };

      console.log('İşlenmiş Veriler:', mockData);
      setDashboardData(mockData);
    } catch (error) {
      console.error('Dashboard verisi yüklenirken hata:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      if (error.response?.status === 401) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        window.location.href = '/login';
      } else if (error.response?.status === 404) {
        toast.error('API endpoint bulunamadı. Lütfen backend servisinin çalıştığından emin olun.');
      } else if (error.response?.status === 500) {
        toast.error('Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.');
      } else if (!error.response) {
        toast.error('Sunucuya bağlanılamıyor. Backend servisinin çalıştığından emin olun.');
      } else {
        toast.error(`Hata: ${error.message}`);
      }
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: dashboardData.monthlyData.labels,
    datasets: [
      {
        label: 'Gelirler',
        data: dashboardData.monthlyData.incomes,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      },
      {
        label: 'Giderler',
        data: dashboardData.monthlyData.expenses,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Aylık Gelir ve Gider Grafiği'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value)
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
          <p className="text-gray-600">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 animate-fade-in">
            Dashboard
          </h1>

          {/* Özet Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-emerald-400 to-green-500 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white/90">Toplam Gelir</h3>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(dashboardData.totalIncome)}
                  </p>
                </div>
                <FaWallet className="text-4xl text-white/80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-rose-400 to-red-500 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white/90">Toplam Gider</h3>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(dashboardData.totalExpense)}
                  </p>
                </div>
                <FaShoppingCart className="text-4xl text-white/80" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-400 to-emerald-500 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white/90">Bakiye</h3>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(dashboardData.balance)}
                  </p>
                </div>
                <FaBalanceScale className="text-4xl text-white/80" />
              </div>
            </div>
          </div>

          {/* Grafik Bölümü */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 transform hover:shadow-2xl transition-shadow duration-300">
            <Bar data={chartData} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  ...chartOptions.plugins.legend,
                  labels: {
                    font: {
                      family: "'Inter', sans-serif",
                      size: 14
                    },
                    usePointStyle: true,
                    padding: 20
                  }
                },
                title: {
                  ...chartOptions.plugins.title,
                  font: {
                    family: "'Inter', sans-serif",
                    size: 18,
                    weight: 'bold'
                  },
                  padding: {
                    top: 20,
                    bottom: 20
                  }
                }
              }
            }} />
          </div>

          {/* Son İşlemler Tablosu */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Son İşlemler</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tarih</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tür</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Kategori</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Açıklama</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Tutar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.recentTransactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {transaction.type === 'income' ? 'Gelir' : 'Gider'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{transaction.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{transaction.description}</td>
                      <td className={`px-6 py-4 text-sm font-medium text-right
                        ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 