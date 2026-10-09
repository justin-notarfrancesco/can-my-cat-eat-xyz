const BLOB_PATH =
  "M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z";

// Two copies of the blob shape drift, rotate, and shift color out of phase
// with each other, giving the blurred background an "aurora" motion.
export default function AnimatedBlob({ id, className }) {
  return (
    <svg className={className} viewBox="0 0 1155 678" overflow="visible" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path className="blob-layer blob-layer-a" fill={`url(#${id}-a)`} fillOpacity=".45" d={BLOB_PATH} />
      <path className="blob-layer blob-layer-b" fill={`url(#${id}-b)`} fillOpacity=".4" d={BLOB_PATH} />
      <defs>
        <linearGradient id={`${id}-a`} x1="1155.49" x2="-78.208" y1=".177" y2="474.645" gradientUnits="userSpaceOnUse">
          <stop className="blob-stop-a1" stopColor="#9089FC" />
          <stop className="blob-stop-a2" offset={1} stopColor="#FF80B5" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="-78.208" x2="1155.49" y1=".177" y2="474.645" gradientUnits="userSpaceOnUse">
          <stop className="blob-stop-b1" stopColor="#FF80B5" />
          <stop className="blob-stop-b2" offset={1} stopColor="#7DD3FC" />
        </linearGradient>
      </defs>
    </svg>
  );
}
