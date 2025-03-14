import { Spinner } from "./svg/spinner";

const Loading = () => {
  return (
    <div
      className="flex flex-row justify-center items-center w-full h-screen bg-transparent"
      role="status"
    >
      <Spinner size="large" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;
