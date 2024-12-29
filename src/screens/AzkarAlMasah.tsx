import React from "react";
import AzkarScreen from "../components/AzkarScreen";
import type AzkarAlSabah from "./AzkarAlSabah";

const AzkarAlMasah: React.FC = () => {
  return (
    <AzkarScreen
      apiUrl="https://ahegazy.github.io/muslimKit/json/azkar_massa.json"
      title="Azkars Al-Masah"
      backgroundColor="#1e3d59"
    />
  );
};

export default AzkarAlMasah;
