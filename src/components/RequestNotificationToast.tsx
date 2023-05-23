import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

interface ChatNotificationProps {
  text: string;
  avatarUrl: string;
}

export default function RequestNotificationToast({
  text,

  avatarUrl,
}: ChatNotificationProps) {
  return (
    <>
      <div className="w-0 flex-1 cursor-pointer p-4">
        <div className="flex items-center ">
          <div className="flex-shrink-0 pt-0.5">
            <img className={`h-10 w-10 rounded-full`} src={avatarUrl} alt="" />
          </div>
          <div className="text-md ml-3 flex-1 font-semibold">
            <span>{text || ""}</span>
          </div>
        </div>
      </div>
    </>
  );
}
