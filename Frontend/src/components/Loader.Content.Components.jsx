export const LoaderContent = () => {
  return (
    <div className="flex h-screen w-full flex-col gap-6 bg-white p-6">
      <div className="h-6 w-32 animate-pulse rounded-full bg-gray-200" />
      <div className="grid flex-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex gap-4">
            <div className="h-20 w-36 animate-pulse rounded-lg bg-gray-200" />
            <div className="flex flex-1 flex-col gap-3 py-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="flex gap-2">
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
