"use client";

import Modal from "@/components/ui/modals/modal";
import { deleteFlashcardCollection } from "@/lib/server-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PiStorefront, PiTrash } from "react-icons/pi";

interface DeleteCardProps {
  cardId: string;
}

const DeleteCard: React.FC<DeleteCardProps> = ({ cardId }) => {
  const router = useRouter();

  const [confirmationInput, setConfirmationInput] = useState("");
  const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);

  const handleConfirmationInputChange = (e: any) => {
    const inputText = e.target.value.toLowerCase();
    setConfirmationInput(inputText);
    setIsDeleteButtonEnabled(inputText === "delete");
  };

  const handleCancel = () => {
    setDeleteCardModalVisible(false);
  };

  const [deleteCardModalVisible, setDeleteCardModalVisible] = useState(false);

  const handleDeleteCardClick = () => {
    setDeleteCardModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmationInput === "delete") {
      try {
        await deleteFlashcardCollection(cardId);
        router.push("/my-cards");
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleDeleteCardClick}
        className=" cursor-pointer bg-red-100 p-4 
    justify-center rounded-md items-center flex"
      >
        <PiTrash className="text-xl text-red-500" />
      </button>

      <Modal
        visible={deleteCardModalVisible}
        setVisible={setDeleteCardModalVisible}
      >
        <div>
          <PiStorefront
            className="text-red-500 mb-10 text-5xl
             bg-red-100 p-1 rounded-md"
          />
          <h1 className="text-xl font-semibold mb-10">
            Delete Flashcard Collection
          </h1>

          <p className="text-sm">
            We&apos;re sorry to see you go. Once your flashcard collection is
            deleted, all of its content will be permanently gone, including your
            flashcards and collection settings.
          </p>

          <p className="text-sm py-10">
            This action cannot be undone. This will permanently delete your
            flashcard collection and all of its content.
          </p>

          <p className="text-sm">To confirm deletion, type “delete” below:</p>

          <input
            type="text"
            className="border w-full p-4 rounded-xl mt-6 focus:outline-none"
            value={confirmationInput}
            onChange={handleConfirmationInputChange}
          />

          <div className="flex justify-end mt-10">
            <button
              className="bg-white text-red-500
             border text-sm rounded-full border-red-500 
             px-4 py-2 mr-4 font-light cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className={`${
                isDeleteButtonEnabled
                  ? "bg-red text-white rounded-full text-sm"
                  : "bg-gray-200 text-gray-500 rounded-full text-sm cursor-not-allowed"
              } px-4 py-2 `}
              disabled={!isDeleteButtonEnabled}
              onClick={handleConfirmDelete}
            >
              Confirm delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteCard;
