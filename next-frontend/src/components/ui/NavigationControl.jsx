"use client";

import { useRouter } from "next/navigation";

function NavigationControl({ styles }) {
  const router = useRouter();

  return (
    <div>
      <button
        className={`btn ${styles}`}
        onClick={() => router.back()}
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
  );
}

export default NavigationControl;
