"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useItems } from "../../../context/ItemContext";
import { useRouter } from "next/navigation";

const BarcodeScannerComponent = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
);

export default function ScanPage() {
  const { items, updateItem } = useItems();
  const router = useRouter();
  const [cameraStarted, setCameraStarted] = useState(false);

  const handleUpdateQuantity = (sku: string) => {
    const item = items.find(i => i.sku === sku);

    if (item) {
      const newQty = Math.max(0, item.quantity - 1);
      updateItem(item.id, { quantity: newQty });

      alert(`✅ ${item.name} quantity decreased by 1`);

      // Go back to the list page
      router.push("/");
    } else {
      // If item doesn't exist, go to Add page
      router.push(`/add?sku=${encodeURIComponent(sku)}`);
    }
  };

  // Try to start camera on mount
  useEffect(() => {
    if (!cameraStarted) setCameraStarted(true);
  }, [cameraStarted]);

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="text-white text-2xl font-bold"
        >
          ✕
        </button>
        <h1 className="text-xl font-semibold text-center flex-1">
          Scan Barcode
        </h1>
        <div className="w-8" />
      </div>

      {/* Camera / Scanner */}
      <div className="w-full max-w-md mx-auto flex justify-center">
        {cameraStarted ? (
          <BarcodeScannerComponent
            width={400}
            height={400}
            videoConstraints={{ facingMode: { exact: "environment" } }}
            onUpdate={(err, result) => {
              if (result) handleUpdateQuantity(result.getText());
            }}
          />
        ) : (
          <button
            onClick={() => setCameraStarted(true)}
            className="p-3 bg-blue-500 text-white rounded-lg"
          >
            Start Camera
          </button>
        )}
      </div>
    </div>
  );
}