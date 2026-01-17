"use client";

import * as React from "react";


export type Step1Data = {
  fullName: string;
  email: string;
  mobile: string;
  classLevel: "9" | "10" | "11" | "12";
  board: "CBSE" | "ICSE" | "State Board";
  preferredLanguage: "English" | "Hindi" | "Hinglish";
};

export type Step2Data = {
  subjects: string[];
  examGoal: "Board Excellence" | "Concept Mastery" | "Competitive Prep";
  weeklyStudyHours: number;
  scholarship: boolean;
  lastExamPercentage?: number;
  achievements?: string;
};

export type Step3Data = {
  pinCode: string;
  state: string;
  city: string;
  addressLine: string;
  guardianName: string;
  guardianMobile: string;
  paymentPlan: "Quarterly" | "Half-Yearly" | "Annual";
  paymentMode: "UPI" | "Card" | "NetBanking";
};

export type EnrollmentData = Partial<Step1Data & Step2Data & Step3Data>;

type EnrollmentContextType = {
  data: EnrollmentData;
  update: (patch: EnrollmentData) => void;
  clear: () => void;
};

const EnrollmentContext = React.createContext<EnrollmentContextType | null>(null);

const STORAGE_KEY = "edzy_enroll_draft_v1";

export function EnrollmentProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<EnrollmentData>({});
  const [hydrated, setHydrated] = React.useState(false);

    React.useEffect(() => {
    if (!hydrated) return;

    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {}
    }, 2000); // ✅ autosave every 2s (debounced)

    return () => clearTimeout(id);
  }, [data, hydrated]);


  // autosave draft (every change)
  React.useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {}
    }, 500);
    return () => clearTimeout(id);
  }, [data, hydrated]);

  const update = (patch: EnrollmentData) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const clear = () => {
    setData({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <EnrollmentContext.Provider value={{ data, update, clear }}>
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const ctx = React.useContext(EnrollmentContext);
  if (!ctx) throw new Error("useEnrollment must be used inside EnrollmentProvider");
  return ctx;
}
