"use client";

import React, { useCallback, useState } from "react";
import Flashcards from "@/app/flashcards/page"; // Import the Flashcards component

// DONT USE categories with spaces
const categories = [
  "Media",
  "Blockchain",
  "Cloud",
  "Commerce",
  "Cybersecurity",
  "Data",
  "Design",
  "Photography",
  "E-commerce",
  "Education",
  "Entertainment",
  "Video",
  "Finance",
  "Social",
  "Health",
  "Fitness",
  "Marketing",
  "Music",
  "Productivity",
  "Engineering",
  "Sales",
  "Sports",
  "Travel",
  "Bootstrapped",
  "Art",
  "Analytics",
];

const NewCard = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [headline, setHeadline] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleHeadlineChange = (e: any) => {
    const headlineText = e.target.value.slice(0, 70);
    setHeadline(headlineText);
  };

  const handleShortDescriptionChange = (e: any) => {
    setShortDescription(e.target.value.slice(0, 300));
  };

  const handleNameChange = (e: any) => {
    const cardName = e.target.value;
    const truncatedName = cardName.slice(0, 30);
    setName(truncatedName);
    const slugValue = truncatedName
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/\./g, "-"); // Replace periods with hyphens in the slug
    setSlug(slugValue);
  };

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter((prevCategory) => prevCategory !== category)
      );
    } else if (selectedCategories.length < 3) {
      setSelectedCategories((prevCategories) => [...prevCategories, category]);
    }
  };

  const nextStep = useCallback(() => {
    setStep(step + 1);
  }, [step]);
  const prevStep = useCallback(() => {
    setStep(step - 1);
  }, [step]);

  return (
    <div className="flex items-center justify-center py-8 md:py-20">
      <div className="px-8 md:w-3/5 md:mx-auto">
        {step === 1 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold"> 📑 New FlashCard Set</h1>
            <p className="text-xl font-light mt-4 leading-8">
              Ready to share your flashcard set with the world? You came to the
              right place! Follow the steps below to get started.
            </p>
            <div className="mt-10">
              <h2 className="font-medium">Name of the card set</h2>
              <input
                type="text"
                value={name}
                maxLength={30}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                onChange={handleNameChange}
              />
              <div className="text-sm text-gray-500 mt-1">
                {name.length} / 30
              </div>
            </div>
            <div className="mt-10">
              <h2 className="font-medium">
                Slug (URL) - This will be used to create a unique URL for your
                card set
              </h2>
              <input
                type="text"
                value={slug}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                readOnly
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold">
              {" "}
              📊 What category does your card set belong to?{" "}
            </h1>
            <p className="text-xl font-light mt-4 leading-8">
              Choose at most 3 categories that best fit your card set. This will
              help people discover your work.
            </p>
            <div className="mt-10">
              <h2 className="font-medium">Select Categories</h2>
              <div className="grid grid-cols-4 gap-2 pt-4 items-center justify-center">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex border rounded-full"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    <div
                      className={`text-xs md:text-sm p-2 cursor-pointer w-full text-center ${
                        selectedCategories.includes(category)
                          ? "bg-[#FF6154] text-white rounded-full"
                          : "text-black"
                      }`}
                    >
                      {category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold"> 📝 Card Set Details </h1>
            <p className="text-xl font-light mt-4 leading-8">
              Provide a simple and clear description of your card set. This will
              help us generate accurate flashcards and ensure people can easily
              grasp its purpose.
            </p>
            <div className="mt-20">
              <h2 className="font-medium">Headline</h2>
              <input
                type="text"
                value={headline}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                onChange={handleHeadlineChange}
              />
              <div className="text-sm text-gray-500 mt-1">
                {headline.length} / 70
              </div>
            </div>
            <div className="mt-10">
              <h2 className="font-medium">Short Description</h2>
              <textarea
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                rows={8}
                maxLength={300}
                value={shortDescription}
                onChange={handleShortDescriptionChange}
              />
              <div className="text-sm text-gray-500 mt-1">
                {shortDescription.length} / 300
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold">
              {" "}
              📚 Generated Flashcards{" "}
            </h1>
            <p className="text-xl font-light mt-4 leading-8">
              Based on the information provided, here are your generated
              flashcards. You can review and edit them if needed.
            </p>
            <Flashcards /> {/* Integrating the Flashcards component here */}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold"> 🔍 Review and submit</h1>
            <p className="text-xl font-light mt-4 leading-8">
              Review the details of your card set and submit it to the world.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-8">
              <div className="">
                <div className="font-semibold">Name of the card set</div>
                <div className=" mt-2 text-gray-600">{name}</div>
              </div>

              <div className="">
                <div className="font-semibold">Slug ( URL ) </div>
                <div className=" mt-2 text-gray-600">{slug}</div>
              </div>

              <div className="">
                <div className="font-semibold">Category</div>
                <div className="  mt-2 text-gray-600">
                  {selectedCategories.join(", ")}
                </div>
              </div>
              <div className="">
                <div className="font-semibold">Headline</div>
                <div className="  mt-2 text-gray-600">{headline}</div>
              </div>
              <div className="">
                <div className="font-semibold">Short description</div>
                <div className=" mt-2 text-gray-600 ">{shortDescription}</div>
              </div>
              {/* Here we also need to add the ai-generated flashcards */}
            </div>
          </div>
        )}

        {step !== 6 && (
          <>
            <div className="flex justify-between items-center mt-10">
              {step !== 1 && (
                <button onClick={prevStep} className="text-gray-600">
                  Previous
                </button>
              )}

              <div className="flex items-center">
                {step === 5 ? (
                  <button className="bg-[#ff6154] text-white py-2 px-4 rounded-md mt-4 items-end">
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="bg-[#ff6154] text-white py-2 px-4 rounded-md mt-4 items-end"
                  >
                    {step === 5 ? "Submit" : "Continue"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewCard;
