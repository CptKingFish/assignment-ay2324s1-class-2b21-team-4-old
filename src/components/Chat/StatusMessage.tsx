interface StatusMessageProps {
  message: string;
}

export default function StatusMessage({ message }: StatusMessageProps) {
  return (
    <div className="my-4 flex flex-1 justify-center">
      <div className="badge-outline badge badge-lg">{message}</div>
    </div>
  );
}
