import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

interface ChatNotificationProps {
  type: "private" | "team";
  text: string;
  username: string;
  team: string | null;
  avatarUrl: string;
  chatroom_id: string;
}

export default function ChatNotification({
  type,
  text,
  username,
  team,
  avatarUrl,
  chatroom_id,
}: ChatNotificationProps) {
  const router = useRouter();
  return (
    <>
      <div
        className="w-0 flex-1 cursor-pointer p-4"
        onClick={() => {
          toast.remove();
          router
            .push(
              `/${
                type === "private" ? "privatechat" : "teamchat"
              }/${chatroom_id}`
            )
            .catch((err) => {
              console.log("err", err);
            });
        }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img
              className={`h-10 w-10 ${
                type === "private" ? "rounded-full" : "rounded-xl"
              }`}
              src={avatarUrl}
              alt=""
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {type === "team" ? team : username}
            </p>

            <div className="mt-1 text-sm text-gray-500">
              {type === "team" ? (
                <span className="pr-1 text-sm font-semibold">
                  {(username || "") + ": "}
                </span>
              ) : null}

              <span>{text || ""}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
