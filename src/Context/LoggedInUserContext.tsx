import React, { createContext, useState, ReactNode } from 'react';

// interface for user data
interface LoggedInUser {
  id?: string;
  name?: string;
  email?: string;
  // Add other user properties as needed
}


type LoggedInUserContextType = [
  LoggedInUser | null,
  React.Dispatch<React.SetStateAction<LoggedInUser | null>>
];

// Create context with type annotation and initial value
export const loggedInUserContext = createContext<LoggedInUserContextType>([
  {},
  () => {},
]);

//props interface for the provider component
interface LoggedInUserContextProviderProps {
  children: ReactNode;
}


export function LoggedInUserContextProvider({ 
  children 
}: LoggedInUserContextProviderProps) {
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>({});

  return (
    <loggedInUserContext.Provider value={[loggedInUser, setLoggedInUser]}>
      {children}
    </loggedInUserContext.Provider>
  );
}