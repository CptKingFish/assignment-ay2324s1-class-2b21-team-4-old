interface ChatNotificationProps {
  text: string;
  username: string;
  avatarUrl: string;
}

export default function ChatNotification({
  text,
  username,
  avatarUrl,
}: ChatNotificationProps) {
  return (
    <>
      <div className="w-0 flex-1 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img className="h-10 w-10 rounded-full" src={avatarUrl} alt="" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {username || ""}
            </p>
            <p className="mt-1 text-sm text-gray-500">{text || ""}</p>
          </div>
        </div>
      </div>
      {/* <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div> */}
    </>
  );
}
