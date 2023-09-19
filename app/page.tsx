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
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { MyItems } from "@/components/MyItems";
import { PrivateMessageChatBox } from "@/components/PrivateMessageChatBox";
import { FloatingChatWidget } from "@/components/FloatingChatWidget";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Home() {
  const { setIsShowingAddBidItemModal, isShowingAddBidItemModal } =
    useGlobalData();

  const [screenType, setScreenType] = useState<"sold" | "my-items">("sold");

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
        <div className="flex flex-grow py-4 gap-x-4">
          <div className="w-3/5 flex flex-col gap-y-2">
            <Stage />
            <div className="flex items-center gap-x-5">
              {screenType === "sold" ? <SoldItems /> : <MyItems />}
              <svg
                width="10"
                height="18"
                viewBox="0 0 10 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
                onClick={() =>
                  setScreenType((prev) =>
                    prev === "my-items" ? "sold" : "my-items"
                  )
                }
              >
                <path
                  d="M9.03055 9.53061L1.53055 17.0306C1.46087 17.1003 1.37815 17.1556 1.2871 17.1933C1.19606 17.231 1.09847 17.2504 0.999929 17.2504C0.901383 17.2504 0.803801 17.231 0.712756 17.1933C0.621712 17.1556 0.538986 17.1003 0.469303 17.0306C0.399621 16.9609 0.344345 16.8782 0.306633 16.7872C0.268921 16.6961 0.249512 16.5985 0.249512 16.5C0.249512 16.4014 0.268921 16.3039 0.306633 16.2128C0.344345 16.1218 0.399621 16.039 0.469303 15.9694L7.43962 8.99999L0.469303 2.03061C0.328573 1.88988 0.249512 1.69901 0.249512 1.49999C0.249512 1.30097 0.328573 1.1101 0.469303 0.969365C0.610034 0.828634 0.800906 0.749573 0.999929 0.749573C1.19895 0.749573 1.38982 0.828634 1.53055 0.969365L9.03055 8.46936C9.10029 8.53902 9.15561 8.62174 9.19335 8.71278C9.23109 8.80383 9.25052 8.90143 9.25052 8.99999C9.25052 9.09855 9.23109 9.19615 9.19335 9.28719C9.15561 9.37824 9.10029 9.46096 9.03055 9.53061Z"
                  fill="#2D2B2B"
                />
              </svg>
            </div>
          </div>
          <BidStream />
        </div>
        <UserProfileData />
        <PrivateMessageChatBox />
        <FloatingChatWidget />
      </div>
      {isShowingAddBidItemModal && (
        <NewItemCreator close={() => setIsShowingAddBidItemModal(false)} />
      )}
    </main>
  );
}
