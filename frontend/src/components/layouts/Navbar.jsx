import React, {useState} from 'react';
import {HiMenuAlt2, HiX} from 'react-icons/hi';
import SideMenu from './SideMenu';

const Navbar = ({activeMenu}) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="sticky top-0 z-50">
      <div className="flex items-center gap-5 bg-white border-b border-gray-200/50 py-4 px-7">
        <button
          className='text-gray-700 hover:text-gray-900 lg:hidden'
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <HiX size={24} />
          ) : (
            <HiMenuAlt2 size={24} />
          )}
        </button>
        
        <h2 className='text-lg font-medium text-black'>Expense Tracker</h2>
      </div>

      {/* Mobile Menu */}
      {openSideMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 lg:hidden z-40" 
            onClick={() => setOpenSideMenu(false)} 
          />
          <div className="fixed top-[65px] left-0 w-64 bg-white shadow-xl lg:hidden z-50">
            <SideMenu activeMenu={activeMenu} />
          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;
