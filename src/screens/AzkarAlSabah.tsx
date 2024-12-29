import React from "react";
import AzkarScreen from "../components/AzkarScreen";

const AzkarAlSabah: React.FC = () => {
  return (
    <AzkarScreen
      apiUrl="https://ahegazy.github.io/muslimKit/json/azkar_sabah.json"
      title="Azkar Al-Sabah"
      backgroundColor="#fefae0"
    />
  );
};

export default AzkarAlSabah;
