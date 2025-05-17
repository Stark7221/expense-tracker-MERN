import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { SIDE_MENU_DATA } from '../../utils/data'; 
import { FiUser } from 'react-icons/fi';

const SideMenu = ({activeMenu}) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route==="logout") {
      handleLogout();
      return
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };
  
  return (
    <div className="w-64 h-screen bg-gray-100 p-4 shadow-md">
      <div className="flex flex-col items-center mb-6">
        {user && user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full mb-2 object-cover border-2 border-gray-200"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/100?text=User";
            }}
          />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
            <FiUser className="text-gray-500 w-10 h-10" />
          </div>
        )}
        
        <h5 className="text-lg font-semibold">{user?.fullName || 'Kullanıcı'}</h5>
      </div>

      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition-colors ${
            activeMenu === item.label
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="w-5 h-5" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
