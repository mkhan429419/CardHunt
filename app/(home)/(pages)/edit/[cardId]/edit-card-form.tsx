"use client";

import { updateFlashcardCollection } from "@/lib/server-actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PiCheckCircle, PiFlag, PiPencilLine, PiXCircle } from "react-icons/pi";
import { toast } from "sonner";

interface EditCardFormProps {
  card: any;
}

const EditCardForm: React.FC<EditCardFormProps> = ({ card }) => {
  const router = useRouter();

  const [name, setName] = useState(card.name);
  const [headline, setHeadline] = useState(card.headline);
  const [description, setDescription] = useState(card.description);
  const [categories, setCategories] = useState(card.categories);
  const [slug, setSlug] = useState(card.slug);

  const handleNameChange = (e: any) => {
    const cardName = e.target.value;
    const truncatedName = cardName.slice(0, 30);
    setName(truncatedName);
  };

  useEffect(() => {
    const truncatedName = name.slice(0, 30);
    const slugValue = truncatedName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "-");
    setSlug(slugValue);
  }, [name]);

  const onSave = async () => {
    try {
      await updateFlashcardCollection(card.id, {
        name,
        headline,
        description,
        slug,
        categories: categories.map((category: any) => category.name),
      });
      toast(
        <>
          <div className="flex items-center gap-4  mx-auto">
            <PiCheckCircle className="text-emerald-500 text-3xl" />
            <div className="text-md font-semibold">
              Flashcard collection updated successfully.
            </div>
          </div>
        </>,
        { position: "top-center" }
      );
      router.refresh();
    } catch (error: any) {
      toast(
        <>
          <div className="flex items-center gap-4  mx-auto">
            <PiXCircle className="text-red-500 text-3xl" />
            <div className="text-md font-semibold">
              There was an error updating the flashcard collection
              {error.message}
            </div>
          </div>
        </>,
        { position: "top-center" }
      );
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center gap-4 mx-auto">
        <PiPencilLine className="text-3xl text-emerald-500" />
        <h1 className="text-3xl font-bold">Edit Flashcard Collection</h1>
      </div>

      <div className="w-full rounded-md p-10 bg-emerald-100 mt-10 md:flex items-center gap-x-4">
        <PiFlag className="text-5xl text-emerald-500 mb-4 md:mb-0" />
        <div className="text-gray-600">
          This is the flashcard collection form. You can update the flashcard collection details here.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <div>
          <h1 className="font-medium">Collection Name</h1>
          <input
            type="text"
            className="w-full p-4 border rounded-xl focus:outline-none mt-6"
            value={name}
            onChange={handleNameChange}
          />
        </div>

        <div>
          <div className="font-medium">Headline</div>
          <textarea
            className="border w-full focus:outline-none mt-6 p-4 rounded-xl"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>

        <div>
          <div className="font-medium">Short Description</div>
          <textarea
            className="border w-full focus:outline-none mt-6 p-4 rounded-xl"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <h1 className="font-medium">Categories</h1>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {categories.map((category: any) => (
              <div key={category.id}>
                <div
                  className="bg-gray-200 p-2
                text-center text-sm rounded-full"
                >
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end py-10">
        <button
          onClick={onSave}
          className="bg-emerald-500 text-white 
        p-4 rounded-md w-40 text-center cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditCardForm;
