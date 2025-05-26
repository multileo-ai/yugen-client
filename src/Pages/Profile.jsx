import React, { useState } from "react";
import ProfileLeftTab from "../Components/ProfileLeftTab";
import CommunityChat from "../Components/CommunityChat";
import EditProfileForm from "../Components/EditProfileForm";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("community");
  const [refreshProfile, setRefreshProfile] = useState(false);

  const handleProfileUpdated = () => {
    setRefreshProfile((prev) => !prev); // Force re-render of ProfileLeftTab
    setActiveTab("community"); // Go back to community tab after edit
  };

  return (
    <div className="flex min-h-screen ">
      {/* Left Sidebar */}
      <ProfileLeftTab
        refreshKey={refreshProfile}
        onEditClick={() => setActiveTab("edit")}
      />

      {/* Right Panel */}
      <div className="flex-1">
        {activeTab === "edit" ? (
          <EditProfileForm onEditClick={handleProfileUpdated} />
        ) : (
          <CommunityChat />
        )}
      </div>
    </div>
  );
};

export default Profile;
