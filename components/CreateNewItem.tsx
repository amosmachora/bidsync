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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Id } from "@/convex/_generated/dataModel";
import { useGlobalData } from "@/hooks/useGlobalData";

export const NewItemCreator = ({ close }: { close: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFilesSrcs, setSelectedFilesSrcs] = useState<string[]>([]);
  const [onStageDuration, setOnStageDuration] = useState<number | null>(null);

  const saveBidItem = useMutation(api.biditems.saveBidItem);
  const addBidItemToStage = useMutation(api.stageitems.addBidItemToStage);

  const userId = useStoreUserEffect();
  const { setStartCountDown } = useGlobalData();

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
        isSold: false,
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
    await handleAddItemToStage(bidItemId);
    toast.success("successfully created bid item");
    setIsSubmitting(false);
  };

  const handleAddItemToStage = async (bidItemId: Id<"biditems">) => {
    if (!onStageDuration) {
      toast.warning("Please pick a duration");
      return;
    }
    await addBidItemToStage({
      bidItemId: bidItemId,
      onStageDuration: onStageDuration!,
      authorId: userId!,
    });
    setStartCountDown(true);
  };

  return (
    <Overlay>
      <form
        className="gap-y-5 flex flex-col fixed top-1/2 z-50 -translate-y-1/2 rounded-md bg-white p-[3%] w-10/12 sm:w-1/2 left-1/2 -translate-x-1/2 shadow-lg shadow-red-100"
        onSubmit={submitProject}
      >
        <FontAwesomeIcon
          icon={faXmark}
          className="h-5 w-5 ml-auto cursor-pointer absolute top-5 right-5"
          onClick={close}
        />
        <h1 className="mt-5 font-semibold">Create a new bid item</h1>
        <div>
          <label htmlFor="title" className="font-medium text-sm">
            Bid title
          </label>
          <Input
            type="text"
            className="project-editor-input"
            name="title"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="font-medium text-sm">
            Description
          </label>
          <Textarea
            className="project-editor-input"
            name="description"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="font-medium text-sm">
            Price (USD)
          </label>
          <Input
            type="number"
            className="project-editor-input uppercase"
            name="price"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="font-medium text-sm">
            Duration (Seconds)
          </label>
          <Select
            onValueChange={(value) => setOnStageDuration(parseInt(value))}
            required
          >
            <SelectTrigger className="w-full mx-auto">
              <SelectValue placeholder="Pick time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time</SelectLabel>
                <SelectItem value={(5 * 60).toString()}>5 mins</SelectItem>
                <SelectItem value={(10 * 60).toString()}>10 mins</SelectItem>
                <SelectItem value={(15 * 60).toString()}>15 mins</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex py-2 px-1 w-full overflow-x-auto gap-x-3">
          {selectedFilesSrcs.map((img, i) => {
            return (
              <div className="relative flex-shrink-0" key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt="image"
                  key={i}
                  className="w-20 aspect-square outline outline-2 outline-[#E03636] rounded object-cover"
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
          className="w-full py-2 rounded bg-[#E03636] text-white hover:bg-red-400 duration-300 text-sm"
          type="submit"
        >
          {isSubmitting ? (
            <FontAwesomeIcon icon={faCircleNotch} className="w-3 h-3" spin />
          ) : (
            "Create bid"
          )}
        </button>
      </form>
    </Overlay>
  );
};
