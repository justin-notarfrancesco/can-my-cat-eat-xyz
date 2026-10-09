import AnimatedBlob from "./AnimatedBlob";

export default function TopBlur() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-[-5rem] -z-10 pointer-events-none transform-gpu blur-3xl sm:top-[-20rem]">
      <AnimatedBlob
        id="top-blur"
        className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
      />
    </div>
  );
}
