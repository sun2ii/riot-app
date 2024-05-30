import React, { createContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [searchData, setSearchData] = useState({
    fullName: '',
    region: 'americas',
    data: null,
    matchHistory: []
  });

  return (
    <AppContext.Provider value={{ searchData, setSearchData }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;