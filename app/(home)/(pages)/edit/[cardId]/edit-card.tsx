"use client";

import EditCardModal from "@/components/ui/modals/edit-card-modal";
import { useState } from "react";
import { PiPencil } from "react-icons/pi";
import EditCardForm from "./edit-card-form";

interface EditCardProps {
  card: any;
}

const EditCard: React.FC<EditCardProps> = ({ card }) => {
  const [editCardModalVisible, setEditCardModalVisible] = useState(false);

  const handleEditCardClick = () => {
    setEditCardModalVisible(true);
  };

  return (
    <>
      <button
        onClick={handleEditCardClick}
        className="bg-emerald-100 p-4 rounded-md 
    flex items-center justify-center cursor-pointer"
      >
        <PiPencil className="text-xl text-emerald-500" />
      </button>

      <EditCardModal
        visible={editCardModalVisible}
        setVisible={setEditCardModalVisible}
      >
        <EditCardForm card={card} />
      </EditCardModal>
    </>
  );
};

export default EditCard;
