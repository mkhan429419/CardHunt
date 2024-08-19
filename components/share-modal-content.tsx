import Image from "next/image";
import { useEffect, useState } from "react";
import { PiCheck, PiCopy } from "react-icons/pi";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Twitter from '@/components/twt.png'
import Instagram from '@/components/insta2.png'
import LinkedIn from '@/components/link.png'
import Facebook from '@/components/face.png'

interface ShareModalContentProps {
  currentCollection?: any; // Add this line to accept currentCollection as an optional prop
  // other props if any
}

const ShareModalContent: React.FC<ShareModalContentProps> = ({
  currentCollection,
}) => {
  const [copiedText, setCopiedText] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const urlPrefix = "https://card-hunt.vercel.app/product/";

  useEffect(() => {
    if (currentCollection && currentCollection.slug) {
      setCopiedText(urlPrefix + currentCollection.slug);
    }
  }, [currentCollection]);

  const handleCopy = () => {
    setIsCopied(true);
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Check out my card collection on CardHunt! ${copiedText}`
  )}`;

  const instagramShareUrl = `https://www.instagram.com/?url=${encodeURIComponent(
    copiedText
  )}`;

  const linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    copiedText
  )}&title=${encodeURIComponent(
    currentCollection?.name || "Check out this collection on CardHunt!"
  )}`;

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    copiedText
  )}`;

  return (
    <div>
      {currentCollection && (
        <>
          {/* <Image
            src={currentCollection.logo || "/default-logo.png"}
            alt="logo"
            width={200}
            height={200}
            className="h-24 w-28 bg-white shadow-md border rounded-md"
          /> */}
          <div className="py-4">
            <h1 className="text-2xl font-semibold">Share this collection</h1>
            <p className="text-gray-600">
              Share this with your friends and family, not yet on CardHunt!
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-100 text-white p-5 rounded-md flex items-center justify-center"
              >
                <Image
                  priority
                  src={Twitter}
                  width={50}
                  height={50}
                  alt="twitter"
                  className="flex items-center justify-center mx-auto"
                />
              </a>

              <a
                href={instagramShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-100 text-white p-5 rounded-md flex items-center justify-center"
              >
                <Image
                  priority
                  src={Instagram}
                  width={50}
                  height={50}
                  alt="instagram"
                  className="flex items-center justify-center mx-auto"
                />
              </a>

              <a
                href={linkedinShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-200 text-white p-5 rounded-md flex items-center justify-center"
              >
                <Image
                  priority
                  src={LinkedIn}
                  width={50}
                  height={50}
                  alt="linkedin"
                  className="flex items-center justify-center mx-auto"
                />
              </a>

              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-400 text-white p-5 rounded-md flex items-center justify-center"
              >
                <Image
                  priority
                  src={Facebook}
                  width={50}
                  height={50}
                  alt="facebook"
                  className="flex items-center justify-center mx-auto"
                />
              </a>
            </div>

            <h1 className="pt-6 font-semibold">Copy Link</h1>
            <div className="mt-2 flex justify-center border rounded-md p-2">
              <input
                type="text"
                value={copiedText}
                className="text-sm md:text-md w-full rounded-md focus:outline-none"
              />
              {isCopied ? (
                <button className="bg-[#3daf64] text-white p-2 rounded-md hover:scale-105">
                  <PiCheck className="text-white" />
                </button>
              ) : (
                <CopyToClipboard text={copiedText} onCopy={handleCopy}>
                  <button className="bg-[#ff6154] text-white p-2 rounded-md hover:scale-105">
                    <PiCopy className="text-white" />
                  </button>
                </CopyToClipboard>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareModalContent;
