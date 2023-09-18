"use client";

import { BidStream } from "@/components/BidStream";
import { Chat } from "@/components/Chat";
import { SoldItems } from "@/components/SoldItems";
import { Navbar } from "@/components/Navbar";
import { Stage } from "@/components/Stage";
import UserProfileData from "@/components/UserProfileData";
import { Id } from "@/convex/_generated/dataModel";
import { GlobalDataProvider, useGlobalData } from "@/hooks/useGlobalData";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Poppins } from "next/font/google";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import { NewItemCreator } from "@/components/CreateNewItem";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  const { setIsShowingAddBidItemModal, isShowingAddBidItemModal } =
    useGlobalData();

  return (
    <main className={`bg-pinkBg h-screen flex ${poppins.className}`}>
      <div className="w-1/5 h-full bg-white flex flex-col">
        <div className="flex items-center px-[8%] py-5 border-b border-pinkBg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/crown.jpg" alt="crown" className="w-10 h-10 mr-5" />
          <p className="font-semibold text-sm">Bidsync</p>
        </div>
        <div className="px-[8%] py-[10%] flex-grow flex flex-col">
          <p className="font-semibold">My bid items</p>
          <div
            className="text-semibold py-3 border rounded text-center border-[#E03636] border-dashed mt-5 cursor-pointer font-semibold text-sm flex items-center justify-center"
            onClick={() => setIsShowingAddBidItemModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
            Add item
          </div>
          <p className="font-semibold mt-10 mb-5">Recent activity</p>
          <Chat />
        </div>
      </div>
      <div className="w-4/5 px-[3%] flex flex-col">
        <Navbar />
        <div className="flex py-4 gap-x-4">
          <div className="w-3/5">
            <Stage />
            <SoldItems />
          </div>
          <BidStream />
        </div>
        <UserProfileData />
      </div>
      {isShowingAddBidItemModal && (
        <NewItemCreator close={() => setIsShowingAddBidItemModal(false)} />
      )}
    </main>
  );
}
