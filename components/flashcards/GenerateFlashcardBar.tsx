import { useState } from "react";
import { PiMagnifyingGlass } from "react-icons/pi";

type GenerateProps = {
  onTopicChange: (topic: string) => void;
};

const Generate = ({ onTopicChange }: GenerateProps) => {
  const [topic, setTopic] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTopic = e.target.value;
    setTopic(newTopic);
    onTopicChange(newTopic); 
  };

  return (
    <div className="rounded-full flex items-center p-5 h-16 text-gray-500 ml-4 bg-[#f5f8ff] relative">
      <PiMagnifyingGlass className="ml-2 text-red" />
      <input
        type="text"
        value={topic}
        placeholder="Enter topic..."
        className="p-2 rounded-full text-xs focus:outline-none bg-[#f5f8ff]"
        onChange={handleChange}
      />
    </div>
  );
};

export default Generate;
