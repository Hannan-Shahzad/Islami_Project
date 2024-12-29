import React from "react";
import AzkarScreen from "../components/AzkarScreen";

const PostPrayerAzkarScreen: React.FC = () => {
  return (
    <AzkarScreen
      apiUrl="https://ahegazy.github.io/muslimKit/json/PostPrayer_azkar.json"
      title="Post-Prayer Azkars"
      backgroundColor="#ffffff"
    />
  );
};

export default PostPrayerAzkarScreen;
