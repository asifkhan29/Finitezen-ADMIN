import { useEffect, useState } from "react";

export function useDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("fz_dark") === "1";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("fz_dark", next ? "1" : "0");
    document.documentElement.classList.toggle("dark", next);
  };
  return { dark, toggle };
}
