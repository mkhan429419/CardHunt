"use client";
import React, { useState, useEffect } from "react";
import Logo from "./logo";
import Search from "./search";
import Menu from "./menu";
import SignInButton from "./sign-in-button";
import SignUpButton from "./sign-up-button";
import Modal from "../ui/modals/modal";
import AuthContent from "./auth-content";
import Avatar from "./avatar";
import NotificationIcon from "./notification-icon";
import Submit from "./submit";

interface NavbarProps {
  initialAuthenticatedUser?: any;
  flashcardCollections?: any; // Add this to pass flashcard collections if needed
}

const Navbar: React.FC<NavbarProps> = ({ initialAuthenticatedUser, flashcardCollections }) => {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(initialAuthenticatedUser);
  const [hydrated, setHydrated] = useState(false); // New state to track hydration

  useEffect(() => {
    setHydrated(true); // Mark hydration as complete
    setAuthenticatedUser(initialAuthenticatedUser); // Sync authenticated user after hydration
  }, [initialAuthenticatedUser]);

  if (!hydrated) {
    // Render a loading state or a placeholder to avoid mismatch during hydration
    return (
      <div className="border-b py-2 md:py-0 px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="h-8 w-full" /> {/* Placeholder for content */}
          <div className="flex items-center space-x-6 cursor-pointer text-sm">
            {/* Placeholder buttons */}
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b py-2 md:py-0 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
          <Search />
        </div>
        <div className="absolute right-1/2 translate-x-1/2 transform z-10">
          <Menu authenticatedUser={authenticatedUser} />
        </div>
        <div className="flex items-center text-sm space-x-6 cursor-pointer">
          {authenticatedUser ? (
            <>
              <Submit authenticatedUser={authenticatedUser} />
              <NotificationIcon />
              <Avatar authenticatedUser={authenticatedUser} />
            </>
          ) : (
            <div onClick={() => setAuthModalVisible(true)} className="flex items-center space-x-6 cursor-pointer text-sm">
              <SignInButton />
              <SignUpButton />
            </div>
          )}
        </div>
        <Modal visible={authModalVisible} setVisible={setAuthModalVisible}>
          <AuthContent />
        </Modal>
      </div>
    </div>
  );
};

export default Navbar;
