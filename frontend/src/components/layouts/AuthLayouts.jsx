import React from 'react';
import CARD_2 from "../../assets/images/CARD_2.png";
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayouts = ({children}) => {
  return (
    <div className='flex'>
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className='text-lg font-medium text-black'>Expense Tracker</h2>
        {children}
      </div>

      <div className="hidden md:flex items-center justify-end w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className='w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5'/>
        <div className='w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10'/>
        <div className='w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5'/>

        {/* StatsInfoCard'ı sol üste taşıdım */}
        <div className="absolute top-8 left-8 z-20">
          <StatsInfoCard
            icon={<LuTrendingUpDown className="text-2xl text-white" />}
            label="Track Your Income and Expenses"
            value="$430.000"
            color="text-white"
            bgColor="bg-primary"
          />
        </div>

        <img    
          src={CARD_2}
          className='max-w-full h-auto object-contain z-10'
        />
      </div>
    </div>
  )
}

export default AuthLayouts;

const StatsInfoCard = ({ icon, label, value, color, bgColor }) => {
  return (
    <div className={`flex flex-col p-5 rounded-md ${bgColor} shadow-sm w-fit`}>
      <div className="flex items-center mb-2">
        {icon && <span className={`mr-2 ${color}`}>{icon}</span>}
        <span className={`${color} opacity-80`}>{label}</span>
      </div>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
  );
};