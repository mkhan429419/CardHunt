"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import MembershipModal from "../ui/modals/upgrade-membership-modal";
import { isUserPremium, getFlashcardCollectionsByUserId } from "@/lib/server-actions";
import UpgradeMembership from "../upgrade-membership";

interface SubmitProps {
  authenticatedUser: any;
}

const Submit: React.FC<SubmitProps> = ({ authenticatedUser }) => {
  const router = useRouter();
  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);

  const handleClick = async () => {
    const isPremium = await isUserPremium(authenticatedUser.user.id);

    const userCollections = await getFlashcardCollectionsByUserId(authenticatedUser.user.id);

    if (!isPremium && userCollections.length >= 1) {
      setIsUpgradeModalVisible(true);
    } else {
      router.push("/new-flashcard");
    }
  };

  return (
    <div>
      <button onClick={handleClick} className="text-[#ff6154]">
        Start new set
      </button>
      <MembershipModal
        visible={isUpgradeModalVisible}
        setVisible={setIsUpgradeModalVisible}
      >
        <UpgradeMembership authenticatedUser={authenticatedUser}/>
      </MembershipModal>
    </div>
  );
};

export default Submit;
