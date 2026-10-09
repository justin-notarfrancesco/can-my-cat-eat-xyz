import AnimatedBlob from "./AnimatedBlob";

export default function BottomBlur() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-25rem)] -z-10 pointer-events-none transform-gpu blur-3xl sm:top-[calc(100%-50rem)]">
      <AnimatedBlob
        id="bottom-blur"
        className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
      />
    </div>
  );
}
