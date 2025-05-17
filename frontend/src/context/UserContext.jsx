import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    //function to update user data
    const updateUser = (userData) => {
        console.log("🔄 Updating user data:", userData);
        setUser(userData);
    };

    const clearUser = () => {
        console.log("🗑️ Clearing user data");
        setUser(null);
        localStorage.removeItem('token');
    };

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get(API_PATHS.AUTH.PROFILE);
            if (response.data.success) {
                console.log("✅ Fetched user profile:", response.data.user);
                setUser(response.data.user);
            } else {
                console.warn("⚠️ Failed to fetch user profile:", response.data.message);
                clearUser();
            }
        } catch (error) {
            console.error('❌ Error fetching user profile:', error);
            clearUser();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const contextValue = {
        user,
        updateUser,
        clearUser,
        loading,
        fetchUserProfile
    };

    return (
        <UserContext.Provider value={contextValue}>
            {!loading && children}
        </UserContext.Provider>
    );
};

export default UserProvider;