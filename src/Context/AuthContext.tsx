import React, { createContext, useState, ReactNode, useContext } from 'react';

type AuthContextType = {
    isAuthorized: boolean;
    login: () => void;
    logout: () => void;
};

const AuthDefaultValue: AuthContextType = {
    isAuthorized: false,
    login: () => { console.warn('login was called before AuthProvider was initialized') },
    logout: () => { console.warn('logout was called before AuthProvider was initialized') }
};

export const AuthContext = createContext<AuthContextType>(AuthDefaultValue);

type AuthProviderProps = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    
    const login = () => {
        setIsAuthorized(true);
    };

    const logout = () => {
        setIsAuthorized(false);
    };
    
    return (
        <AuthContext.Provider value={{ isAuthorized, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;