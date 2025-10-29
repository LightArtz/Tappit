"use client"

import type React from "react"
import { useState } from "react"
import { X, Loader2, ChevronRight, ChevronLeft, Upload } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { useToast } from "./toast-provider"

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
}

type FormStep = "details" | "payment" | "confirm"

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const { addToast } = useToast()
  const [step, setStep] = useState<FormStep>("details")
  const [isLoading, setIsLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>("")

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nfcLink: "",
    design: "Classic Cyan",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleNextStep = () => {
    if (step === "details") {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.nfcLink) {
        addToast("Please fill in all required fields", "error")
        return
      }
      setStep("payment")
    } else if (step === "payment") {
      if (!photoFile) {
        addToast("Please upload your proof of payment", "error")
        return
      }
      setStep("confirm")
    }
  }

  const handlePrevStep = () => {
    if (step === "payment") {
      setStep("details")
    } else if (step === "confirm") {
      setStep("payment")
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step !== "confirm") {
      console.warn("handleSubmit called on incorrect step:", step);
      return; // Do nothing if not on the confirm step
    }

    setIsLoading(true);

    let paymentProofUrl = null;
    if (photoFile) {
      const filePath = `payment_proofs/${Date.now()}_${photoFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('order-proofs') // BUCKET NAME - Make sure this bucket exists and has correct policies!
        .upload(filePath, photoFile);

      if (uploadError) {
        console.error('Error uploading payment proof:', uploadError);
        addToast('Failed to upload payment proof. Please try again.', 'error');
        setIsLoading(false);
        return;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('order-proofs') // BUCKET NAME
        .getPublicUrl(filePath);

      paymentProofUrl = urlData?.publicUrl;
    }


    try {
      // IMPORTANT: Adjust Supabase insert data
      const { error } = await supabase.from("orders").insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          nfc_link: formData.nfcLink, // Use the correct field name
          design: formData.design,
          payment_proof_url: paymentProofUrl, // Use the uploaded URL or null
          status: "pending_verification", // Or your preferred initial status after submission
          // price: 25000, // No need to send if default is set in DB, unless price varies
        },
      ]).select(); // Added .select() to get potential errors returned properly

      if (error) throw error;

      addToast("Order placed successfully! We'll contact you soon.", "success");

      // --- Reset State ---
      setFormData({ // Reset form data
        fullName: "",
        email: "",
        phone: "",
        nfcLink: "",
        design: "Classic Cyan",
      });
      setPhotoFile(null); // Reset file state
      setPhotoPreview(""); // Reset preview
      setStep("details"); // Go back to the first step
      // --- End Reset State ---

      setTimeout(() => {
        onClose(); // Close modal after success
      }, 1500);
    } catch (error) {
      console.error("Order submission error:", error);
      addToast("Failed to place order. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Order Tappit</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="px-6 pt-4 flex gap-2">
          {(["details", "payment", "confirm"] as const).map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                step === s
                  ? "bg-cyan-500"
                  : ["details", "payment"].includes(s) && step === "confirm"
                    ? "bg-cyan-500"
                    : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Step 1: Details */}
          {step === "details" && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="081212345678"
                />
              </div>

              <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Link for NFC *</label>
              <input
                type="url"
                required
                value={formData.nfcLink}
                onChange={(e) => setFormData({ ...formData, nfcLink: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., https://instagram.com/yourusername"
              />
              <p className="text-xs text-gray-500 mt-1">This link will be programmed into your Tappit.</p>
            </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Design *</label>
                <select
                  value={formData.design}
                  onChange={(e) => setFormData({ ...formData, design: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option>Classic Cyan</option>
                  <option>Ocean Blue</option>
                  <option>Purple Dream</option>
                  <option>Sunset</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === "payment" && (
            <div className="space-y-6 animate-in fade-in"> 
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Payment Details</label>
                <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-semibold text-gray-900">BCA</span> {/* Replace with your bank */}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account No:</span>
                    <span className="font-semibold text-gray-900">1234567890</span> {/* Replace with your account number */}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Name:</span>
                    <span className="font-semibold text-gray-900">PT Tappit Indonesia</span> {/* Replace with your account name */}
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300 mt-2">
                    <span className="text-gray-600 font-bold">Amount to Pay:</span>
                    <span className="font-bold text-lg text-cyan-600">Rp 25.000</span> {/* Your fixed price */}
                  </div>
                </div>
              </div>

              {/* Upload Proof of Payment Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Upload Proof of Payment *</label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                    required={true}
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer block">
                    {photoPreview ? (
                      <div className="space-y-2">
                        <img
                          src={photoPreview} 
                          alt="Preview"
                          className="w-20 h-20 mx-auto rounded-lg object-cover border"
                        />
                        <p className="text-sm text-gray-600">Click or drop image to change</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Drop your image here, or <span className="text-cyan-600 font-semibold">browse</span>
                        </p>
                        <p className="text-xs text-gray-500">JPG, PNG, max 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
                {/* Optional: Add error message if photoFile is null and required */}
              </div>

              {/* Note */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Please transfer the exact amount and upload the proof of payment to proceed.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-900">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-900">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold text-gray-900">{formData.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">NFC Link:</span>
                  <span className="font-semibold text-gray-900 truncate max-w-[50%]" title={formData.nfcLink}>{formData.nfcLink}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Design:</span>
                  <span className="font-semibold text-gray-900">{formData.design}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup:</span>
                  <span className="font-semibold text-gray-900">Campus Booth</span>
                </div>
              </div>

              {photoPreview && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Payment Proof:</p>
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Payment proof"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <p className="text-sm text-cyan-900">
                  <strong>Ready to go!</strong> Click "Place Order" to complete your order. We'll contact you with
                  pickup details.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {step !== "details" && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <ChevronLeft size={20} />
                Back
              </button>
            )}

            {step !== "confirm" ? (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); handleNextStep(); }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
