import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface PotContextType {
  pots: any[];
  setPots: React.Dispatch<React.SetStateAction<any[]>>;
  addPot: (pot: any) => void;
  clearPots: () => Promise<void>;
}

const PotContext = createContext<PotContextType | null>(null);

export const PotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pots, setPots] = useState<any[]>([]);

  // 🔐 Load saved pots on startup
  useEffect(() => {
    AsyncStorage.getItem("pots").then((data) => {
      if (data) {
        setPots(JSON.parse(data));
      }
    });
  }, []);

  //  Save pots when they change
  useEffect(() => {
    AsyncStorage.setItem("pots", JSON.stringify(pots));
  }, [pots]);

  const addPot = (pot: any) => {
    setPots((prev) => [...prev, pot]);
  };

  const clearPots = async () => {
    setPots([]); // clear from state
    await AsyncStorage.removeItem("pots"); // clear from storage
  };

  return <PotContext.Provider value={{ pots, setPots, addPot, clearPots }}>{children}</PotContext.Provider>;
};

export const usePot = () => useContext(PotContext);

// Default export for the file
export default PotProvider;
