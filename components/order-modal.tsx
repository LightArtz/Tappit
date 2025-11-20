"use client"

import type React from "react"
import { useState, useRef } from "react"
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

  const isSubmittingRef = useRef(false)

  // State for Payment Proof
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>("")

  // State for Custom Design (Optional)
  const [designFile, setDesignFile] = useState<File | null>(null)
  const [designPreview, setDesignPreview] = useState<string>("")

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nfcLink: "",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  // --- Handlers ---

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
    if (step === "payment") setStep("details")
    else if (step === "confirm") setStep("payment")
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDesignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDesignFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setDesignPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step !== "confirm") return

    if (isSubmittingRef.current) return
    isSubmittingRef.current = true

    setIsLoading(true)

    try {
      // 1. Upload Payment Proof (Required)
      let paymentProofUrl = null
      if (photoFile) {
        const filePath = `payment_proofs/${Date.now()}_${photoFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('order-proofs')
          .upload(filePath, photoFile)

        if (uploadError) throw uploadError
        
        const { data } = supabase.storage.from('order-proofs').getPublicUrl(filePath)
        paymentProofUrl = data.publicUrl
      }

      // 2. Upload Custom Design (Optional) & Determine 'design' value
      let designValue = "Standard" // Default value

      if (designFile) {
        const designPath = `custom_designs/${Date.now()}_${designFile.name}`
        const { error: designError } = await supabase.storage
          .from('order-proofs')
          .upload(designPath, designFile)

        if (designError) throw designError

        const { data } = supabase.storage.from('order-proofs').getPublicUrl(designPath)
        designValue = data.publicUrl // Set value to URL if uploaded
      }

      // 3. Insert into Database
      const { error } = await supabase.from("orders").insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          nfc_link: formData.nfcLink,
          design: designValue, // Will be 'Standard' or the URL
          payment_proof_url: paymentProofUrl,
          status: "pending_payment_verification",
        },
      ]).select()

      if (error) throw error

      addToast("Order placed successfully!", "success")
      
      // Reset Form
      setFormData({ fullName: "", email: "", phone: "", nfcLink: "" })
      setPhotoFile(null); setPhotoPreview("")
      setDesignFile(null); setDesignPreview("")
      setStep("details")
      setTimeout(() => onClose(), 1500)

    } catch (error) {
      console.error("Error:", error)
      addToast("Failed to place order.", "error")
      isSubmittingRef.current = false
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Order Tappit</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4 flex gap-2">
          {(["details", "payment", "confirm"] as const).map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                step === s ? "bg-cyan-500" : ["details", "payment"].includes(s) && step === "confirm" ? "bg-cyan-500" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* STEP 1: DETAILS */}
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
                  placeholder="0812xxxx"
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
                  placeholder="https://instagram.com/..."
                />
              </div>

              {/* Custom Design Upload - Single Option */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Custom Design (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDesignChange}
                    className="hidden"
                    id="design-upload"
                  />
                  <label htmlFor="design-upload" className="cursor-pointer block">
                    {designPreview ? (
                      <div className="space-y-2">
                        <img src={designPreview} alt="Design" className="w-full h-32 object-cover rounded-lg border" />
                        <p className="text-sm text-cyan-600 font-medium">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-6 h-6 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">Upload your design here</p>
                        <p className="text-xs text-gray-400">Leave empty for Standard design</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === "payment" && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Payment Details</label>
                <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-semibold text-gray-900">BCA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account No:</span>
                    <span className="font-semibold text-gray-900">7010573020</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-gray-900">Jordi Austin Iskandar</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300 mt-2">
                    <span className="text-gray-600 font-bold">Total:</span>
                    <span className="font-bold text-lg text-cyan-600">Rp 25.000</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Upload Proof *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer block">
                    {photoPreview ? (
                      <div className="space-y-2">
                        <img src={photoPreview} alt="Proof" className="w-20 h-20 mx-auto rounded-lg object-cover border" />
                        <p className="text-sm text-gray-600">Click to change</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="w-6 h-6 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">Upload payment proof</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRM */}
          {step === "confirm" && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-gray-50 rounded-lg space-y-3 text-sm">
                <h3 className="font-semibold text-gray-900 mb-3 text-base">Order Summary</h3>
                <div className="flex justify-between"><span className="text-gray-600">Name:</span> <span className="font-medium">{formData.fullName}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Phone:</span> <span className="font-medium">{formData.phone}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Link:</span> <span className="font-medium truncate max-w-[150px]">{formData.nfcLink}</span></div>
                
                <div className="border-t border-gray-200 my-2"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Design Type:</span>
                  <span className={`font-bold px-2 py-1 rounded text-xs ${designFile ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700'}`}>
                    {designFile ? "Custom Upload" : "Standard"}
                  </span>
                </div>

                {designPreview && (
                   <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Custom Design Preview:</p>
                      <img src={designPreview} alt="Custom Design" className="w-full h-32 object-cover rounded-lg border" />
                   </div>
                )}
              </div>

              <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200 text-sm text-cyan-900">
                <strong>Almost done!</strong> Review your details above and click Place Order.
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {step !== "details" && (
              <button type="button" onClick={handlePrevStep} className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 cursor-pointer">
                <ChevronLeft size={20} className="inline mr-1" /> Back
              </button>
            )}
            
            {step !== "confirm" ? (
              <button key="next-button" type="button" onClick={handleNextStep} className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                Next <ChevronRight size={20} />
              </button>
            ) : (
              <button key="submit-button" type="submit" disabled={isLoading} className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                {isLoading ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : "Place Order"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}