import Link from "next/link";

const Submit = () => {
  return (
    <div>
      <Link href="/new-flashcard" className="text-[#ff6154]">
        Start new set
      </Link>
    </div>
  );
};

export default Submit;
