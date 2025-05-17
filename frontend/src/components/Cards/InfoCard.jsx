import React from 'react';

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="bg-white flex gap-6 p-6 rounded-2xl shadow-md  items-center ">
      <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full shadow-lg`}>
        {icon}
      </div>
      <div>
        <h6 className="text-sm text-gray-500">{label}</h6>
        <span className="text-lg font-semibold">${value}</span>
      </div>
    </div>
  );
};

export default InfoCard;
