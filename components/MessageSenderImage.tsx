import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const MessageSenderImage = ({
  senderImageUrl,
}: {
  senderImageUrl: string | null;
}) => {
  return (
    <div className="w-4 h-4 outline outline-blue-500 outline-2 rounded-full relative overflow-clip mt-2">
      {senderImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={senderImageUrl} alt={""} className="" />
      ) : (
        <FontAwesomeIcon icon={faUser} className="w-2 h-2 center-absolutely" />
      )}
    </div>
  );
};
