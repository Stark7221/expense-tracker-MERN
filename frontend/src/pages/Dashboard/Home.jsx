import React, { useState , useEffect } from 'react';
import DasboardLayout from '../../components/layouts/DasboardLayout';
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import InfoCard from "../../components/Cards/InfoCard";
import {IoMdCard} from "react-icons/io";
import {LuHandCoins, LuWalletMinimal} from "react-icons/lu";
import {addThousandsSeperator} from "../../utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions"

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashbaordData = async () => {
    if (loading) return; // Eğer zaten yükleniyorsa, tekrar başlatma
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      if (response.data) {
        setDashboardData(response.data);
        console.log("Dashboard data:", response.data);
      }
    } catch (error) {
      console.error("Bir hata oluştu, lütfen tekrar deneyin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    return()=>{
      fetchDashbaordData();
    }
  });

  return (
    <>
      <DasboardLayout activeMenu ="Dasboard">
        <div className="my-5 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
           <InfoCard
           icon ={<IoMdCard/>}
            label="total balance"
            value={addThousandsSeperator(dashboardData?.totalBalance)}
            color="bg-primary"
           />

           <InfoCard
           icon ={<IoMdCard/>}
            label="total Income"
            value={addThousandsSeperator(dashboardData?.totalIncome
              ||0)}
            color="bg-orange-500"
           />

           <InfoCard
           icon ={<IoMdCard/>}
            label="total Expense"
            value={addThousandsSeperator(dashboardData?.totalExpense)}
            color="bg-red-500"
           />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <RecentTransactions
            transactions = {dashboardData?.recentTransactions}
            onSeeMore={()=>navigate("/expense")}
            />
          </div>
        </div>
      </DasboardLayout>
    </>
  )
}

export default Home
