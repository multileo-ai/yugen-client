import React, { useState } from "react";
import ProfileLeftTab from "../Components/ProfileLeftTab";
import CommunityChat from "../Components/CommunityChat";
import EditProfileForm from "../Components/EditProfileForm";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("community");
  const [refreshProfile, setRefreshProfile] = useState(false);
  const [viewedUser, setViewedUser] = useState(null); // New

  const handleProfileUpdated = () => {
    setRefreshProfile((prev) => !prev);
    setActiveTab("community");
  };

  const handleUserClick = (username) => {
    setViewedUser(username); // View someone else
  };

  const handleCloseProfileView = () => {
    setViewedUser(null); // Go back to own profile
  };

  return (
    <div className="flex min-h-screen">
      <ProfileLeftTab
        selectedUser={viewedUser} // ✅ Correct variable
        onEditClick={() => setActiveTab("edit")}
        onCloseClick={handleCloseProfileView}
        refreshKey={refreshProfile}
      />

      <div className="flex-1">
        {activeTab === "edit" ? (
          <EditProfileForm onEditClick={handleProfileUpdated} />
        ) : (
          <CommunityChat onUserClick={handleUserClick} />
        )}
      </div>
    </div>
  );
};

export default Profile;
