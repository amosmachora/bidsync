"use client";

import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { BidItem } from "@/types/globals";
import {
  faCircleNotch,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Overlay } from "./Overlay";
import { Input } from "./ui/input";
import { UploadButton } from "./UploadButton";

export const NewItemCreator = ({ close }: { close: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFilesSrcs, setSelectedFilesSrcs] = useState<string[]>([]);
  const saveBidItem = useMutation(api.biditems.saveBidItem);
  const userId = useStoreUserEffect();

  useEffect(() => {
    const loadImages = async () => {
      const selectedFilesSrcs: string[] = [];

      for (const file of selectedFiles) {
        const reader = new FileReader();
        const promise = new Promise<string>((resolve) => {
          reader.onload = (e) => {
            resolve(e.target!.result as string);
          };
        });

        reader.readAsDataURL(file!);

        selectedFilesSrcs.push(await promise);
      }

      setSelectedFilesSrcs(selectedFilesSrcs);
    };

    loadImages();
  }, [selectedFiles]);

  const addFileToSelectedFiles = (file: File) => {
    const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

    if (file.size <= MAX_FILE_SIZE_BYTES) {
      setSelectedFiles((prev) => [...prev, file]);
    } else {
      toast.warning("File size exceeds the maximum allowed size (20MB).");
    }
  };

  const deleteUnsavedImage = (i: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => {
        return i !== index;
      })
    );
  };

  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast.error("You need to add at-least one image");
    }

    const formData = new FormData(e.target as HTMLFormElement);

    const projectData: BidItem = {
      author: userId!,
      price: formData.get("price") as string,
      description: formData.get("description") as string,
      title: formData.get("title") as string,
    };

    setIsSubmitting(true);
    const bidItemId = await saveBidItem({
      body: {
        ...projectData,
      },
    });

    const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
    const sendImageUrl = new URL(`${convexSiteUrl}/uploadImage`);
    sendImageUrl.searchParams.set("bidItemId", bidItemId);

    for (const file of selectedFiles) {
      try {
        await fetch(sendImageUrl, {
          method: "POST",
          headers: {
            "Content-Type": file!.type,
          },
          body: file,
          mode: "no-cors",
        });
      } catch (error) {
        console.log(error);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <Overlay>
      <form
        className="gap-y-5 flex flex-col fixed top-1/2 z-50 -translate-y-1/2 rounded-md bg-white p-[3%] w-10/12 sm:w-1/2 left-1/2 -translate-x-1/2 shadow-md"
        onSubmit={submitProject}
      >
        <FontAwesomeIcon
          icon={faXmark}
          className="h-5 w-5 text-blue-600 ml-auto cursor-pointer absolute top-5 right-5"
          onClick={close}
        />
        <h1 className="mt-5">Create a new bid item</h1>
        <Input
          type="text"
          className="project-editor-input"
          name="title"
          placeholder="Bid title"
          required
        />
        <Textarea
          className="project-editor-input"
          name="description"
          placeholder="description"
          required
        />
        <Input
          type="text"
          className="project-editor-input uppercase"
          name="price"
          placeholder="Price"
          required
        />
        <div className="flex py-2 px-1 w-full overflow-x-auto gap-x-3">
          {selectedFilesSrcs.map((img, i) => {
            return (
              <div className="relative flex-shrink-0" key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt="image"
                  key={i}
                  className="w-20 aspect-square outline outline-2 outline-blue-500 rounded object-cover"
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="h-3 w-3 text-white absolute top-1 right-1 cursor-pointer"
                  onClick={() => deleteUnsavedImage(i)}
                />
              </div>
            );
          })}
          <UploadButton addFileFunction={addFileToSelectedFiles} />
        </div>
        <button
          className="w-full py-2 rounded bg-blue-500 text-white hover:bg-blue-400 duration-300"
          type="submit"
        >
          {isSubmitting ? (
            <FontAwesomeIcon icon={faCircleNotch} className="w-3 h-3" spin />
          ) : (
            "Save"
          )}
        </button>
      </form>
    </Overlay>
  );
};
