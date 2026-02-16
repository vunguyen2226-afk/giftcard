"use client"

import { useRef } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Download } from "lucide-react"
import { motion } from "motion/react"
import { useTranslation } from "@/lib/i18n"

interface QrCodeGeneratorProps {
  url: string
  title?: string
}

export function QrCodeGenerator({ url, title = "Card QR Code" }: QrCodeGeneratorProps) {
  const { t } = useTranslation()
  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas")
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800">{t.shareButtons.scanToView}</h3>

      <div
        ref={qrRef}
        className="p-4 bg-white rounded-lg border-2 border-gray-300"
      >
        <QRCodeCanvas
          value={url}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      <motion.button
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors text-sm font-medium text-white"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Download className="w-4 h-4" />
        {t.shareButtons.downloadQR}
      </motion.button>
    </div>
  )
}
