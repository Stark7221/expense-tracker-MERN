import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from "../../utils/helper.js"
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/UserContext.jsx';
import { FiPieChart, FiTrendingUp, FiShield, FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

const sliderData = [
  {
    icon: <FiPieChart className="w-8 h-8 text-emerald-600" />,
    title: "Harcamalarını Anlık Takip Et",
    desc: "Gelir ve giderlerini kolayca yönet, finansal sağlığını anında gör."
  },
  {
    icon: <FiTrendingUp className="w-8 h-8 text-emerald-600" />,
    title: "Akıllı Raporlar",
    desc: "Gelişmiş grafikler ve raporlarla harcamalarını analiz et."
  },
  {
    icon: <FiShield className="w-8 h-8 text-emerald-600" />,
    title: "Güvenli ve Hızlı",
    desc: "Verilerin bulutta güvenle saklanır, her yerden erişebilirsin."
  }
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Slider otomatik geçiş
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderData.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Lütfen geçerli bir email adresi girin");
      return;
    }
    if (!password) {
      setError("Lütfen şifrenizi girin");
      return
    }
    setError("");
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      if (response.data.success) {
        const { token, ...userData } = response.data.user;
        localStorage.setItem("token", token);
        updateUser(userData);
        navigate("/dashboard");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="w-full max-w-5xl h-[600px] flex rounded-3xl shadow-2xl overflow-hidden">
        {/* Sol: Slider */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-400 to-teal-500 p-12 flex-col justify-between relative">
          <div className="flex flex-col h-full justify-center items-center text-white text-center">
            <div className="mb-8 animate-fade-in">
              <FiUser className="w-16 h-16 mx-auto mb-4 text-white/80" />
              <h2 className="text-4xl font-bold mb-2 tracking-tight">Finance Tracker</h2>
              <p className="text-lg text-emerald-50">Kişisel finansını yönetmenin en kolay yolu</p>
            </div>
            <div className="w-full max-w-xs mx-auto bg-white/10 rounded-2xl p-6 shadow-lg animate-slider">
              <div className="flex flex-col items-center space-y-3">
                {sliderData[sliderIndex].icon}
                <h3 className="text-xl font-semibold">{sliderData[sliderIndex].title}</h3>
                <p className="text-sm text-emerald-50">{sliderData[sliderIndex].desc}</p>
              </div>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              {sliderData.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${sliderIndex === idx ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>
          {/* Dekoratif daireler */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 animate-pulse" />
        </div>

        {/* Sağ: Login Formu */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-12">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900">Hoş Geldin!</h3>
              <p className="mt-2 text-gray-600">Hesabına giriş yap</p>
            </div>
            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                    type="email"
                    placeholder="Email Adresi"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-200"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    type="password"
                    placeholder="Şifre"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-200"
                  />
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-shake">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3 px-4 flex items-center justify-center bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transform hover:scale-[1.02] transition-all duration-200"
              >
                <span>Giriş Yap</span>
                <FiArrowRight className="ml-2 h-5 w-5" />
              </button>
              <p className="text-center text-gray-600 text-sm">
                Hesabın yok mu?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Kayıt Ol
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;