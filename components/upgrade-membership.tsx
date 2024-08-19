import Image from "next/image";
import Rocket from "@/components/rocket.png";
import { setUserPremium } from "@/lib/server-actions"; // Assume this function updates the user's premium status
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook

const UpgradeMembership = ({
  authenticatedUser,
}: {
  authenticatedUser: any;
}) => {
  const [loading, setLoading] = useState(false);
  const [isUpgraded, setIsUpgraded] = useState(false); // State to track if the upgrade is successful
  const router = useRouter(); // Initialize the router

  const handleUpgradeMembership = async () => {
    if (isUpgraded) {
      // If the user has already upgraded, navigate to /new-flashcard
      router.push("/new-flashcard");
      return;
    }

    setLoading(true);
    try {
      await setUserPremium(authenticatedUser.user.id); // Set the user to premium
      setIsUpgraded(true); // Set the upgraded state to true
    } catch (error) {
      console.error("Error upgrading membership:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Image
        src={Rocket}
        width={200}
        height={200}
        alt="Upgrade Membership"
        className="mx-auto"
      />
      {isUpgraded ? (
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-green-500">
            🎉 Congratulations!
          </h1>
          <p className="text-gray-600">
            Your membership has been successfully upgraded. You can create
            unlimited card sets and share them with the world!
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-semibold text-center">
            Go Pro and unlock more features
          </h1>
          <p className="text-gray-600 text-center">
            Looking to create more projects? Upgrade your membership to unlock
            unlimited projects.
          </p>
        </>
      )}

      <div className="pt-4">
        <button
          onClick={handleUpgradeMembership}
          className="bg-indigo-500 text-white p-2 rounded-md w-full"
          disabled={loading}
        >
          {loading
            ? "Upgrading..."
            : isUpgraded
            ? "Start New Set"
            : "Upgrade Membership"}
        </button>
      </div>
    </div>
  );
};

export default UpgradeMembership;
