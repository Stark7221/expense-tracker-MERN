import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from "../../utils/helper.js"
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/UserContext.jsx';
import UploadImage from '../../utils/uploadImage.js';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector.jsx';
import { FiUserPlus, FiShield, FiCloud, FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

const sliderData = [
  {
    icon: <FiUserPlus className="w-8 h-8 text-indigo-600" />,
    title: "Kolay Kayıt",
    desc: "Dakikalar içinde hesabını oluştur, finansal yolculuğuna başla."
  },
  {
    icon: <FiShield className="w-8 h-8 text-indigo-600" />,
    title: "Güvenli Kullanım",
    desc: "Verileriniz 256-bit şifreleme ile güvende kalır."
  },
  {
    icon: <FiCloud className="w-8 h-8 text-indigo-600" />,
    title: "Bulut Desteği",
    desc: "Verileriniz bulutta saklanır, her yerden erişebilirsiniz."
  }
];

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [sliderIndex, setSliderIndex] = useState(0);

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  // Slider otomatik geçiş
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderData.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";
    
    if (!fullName) {
      setError("please enter your full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("please enter a valid email adress");
      return;
    }

    if (!password) {
      setError("please enter the password");
      return;
    }

    setError("");

    try {
      //upload image if present
      if (profilePic) {
        const imgUploadRes = await UploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
        console.log("Image upload response:", imgUploadRes);
        if (!profileImageUrl) {
          setError("Image upload failed. Please try again.");
          return;
        }
      }
      
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl
      });

      console.log("✅ sign response:", response);
      const { token, user } = response.data.user;
      console.log("🔑 token:", token, "user:", user);
    
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        console.log("➡️ Navigating to /login");
        navigate("/login");
      } else {
        console.warn("⚠️ Token yok, navigate tetiklenmeyecek");
      }
    } 
    catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="w-full max-w-6xl h-[650px] flex rounded-3xl shadow-2xl overflow-hidden">
        {/* Sol Taraf - Slider */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 p-12 flex-col justify-between relative">
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center">
            <div className="mb-8 animate-fade-in">
              <FiUser className="w-16 h-16 mx-auto mb-4 text-white/80" />
              <h2 className="text-4xl font-bold mb-2">Finance Tracker</h2>
              <p className="text-lg text-indigo-100">Kişisel finansını yönetmenin en kolay yolu</p>
            </div>
            
            <div className="w-full max-w-xs mx-auto bg-white/10 rounded-2xl p-6 shadow-lg animate-slider">
              <div className="flex flex-col items-center space-y-3">
                {sliderData[sliderIndex].icon}
                <h3 className="text-xl font-semibold">{sliderData[sliderIndex].title}</h3>
                <p className="text-sm text-indigo-100">{sliderData[sliderIndex].desc}</p>
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

          {/* Dekoratif elementler */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 animate-pulse" />
        </div>

        {/* Sağ Taraf - Kayıt Formu */}
        <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800">Kayıt Ol</h3>
              <p className="text-gray-600 mt-2">Hesabınızı hemen oluşturun</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="flex justify-center mb-6">
                <ProfilePhotoSelector 
                  image={profilePic} 
                  setImage={setProfilePic}
                  className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full" 
                />
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={fullName}
                    onChange={({ target }) => setFullName(target.value)}
                    type="text"
                    placeholder="Ad Soyad"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={email}
                    onChange={({ target }) => setEmail(target.value)}
                    type="email"
                    placeholder="Email Adresi"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200"
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
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200"
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
                className="w-full py-3 px-4 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transform hover:scale-[1.02] transition-all duration-200"
              >
                <span>Kayıt Ol</span>
                <FiArrowRight className="ml-2 h-5 w-5" />
              </button>

              <p className="text-center text-gray-600 text-sm mt-6">
                Zaten hesabınız var mı?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Giriş Yap
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;