"use client"

import { useState, useEffect, useRef } from "react"
import { Settings, Palette, Image as ImageIcon, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export type BackgroundType = "solid" | "gradient" | "image"

export interface BackgroundSettings {
  type: BackgroundType
  value: string // color, gradient, or image URL
}

interface BackgroundSettingsProps {
  background: BackgroundSettings
  onBackgroundChange: (background: BackgroundSettings) => void
}

const PRESET_COLORS = [
  { name: "Default", value: "hsl(var(--background))" },
  { name: "White", value: "#ffffff" },
  { name: "Light Gray", value: "#f3f4f6" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Green", value: "#10b981" },
  { name: "Orange", value: "#f97316" },
]

const PRESET_GRADIENTS = [
  { name: "Sunset", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Ocean", value: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)" },
  { name: "Coral", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Forest", value: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
  { name: "Lavender", value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { name: "Peach", value: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
  { name: "Sky", value: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)" },
  { name: "Sunrise", value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
]

export function BackgroundSettings({ background, onBackgroundChange }: BackgroundSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState("#ffffff")
  const [customImageUrl, setCustomImageUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (background.type === "solid" && !PRESET_COLORS.find((c) => c.value === background.value)) {
      setCustomColor(background.value)
    }
    if (background.type === "image") {
      setCustomImageUrl(background.value)
    }
  }, [background])

  const handleTypeChange = (type: BackgroundType) => {
    if (type === "solid") {
      onBackgroundChange({ type: "solid", value: PRESET_COLORS[0].value })
    } else if (type === "gradient") {
      onBackgroundChange({ type: "gradient", value: PRESET_GRADIENTS[0].value })
    } else {
      onBackgroundChange({ type: "image", value: "" })
    }
  }

  const handleColorSelect = (color: string) => {
    onBackgroundChange({ type: "solid", value: color })
  }

  const handleGradientSelect = (gradient: string) => {
    onBackgroundChange({ type: "gradient", value: gradient })
  }

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color)
    onBackgroundChange({ type: "solid", value: color })
  }

  const handleImageFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB")
        return
      }

      // Convert file to data URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        setCustomImageUrl(dataUrl)
        onBackgroundChange({ type: "image", value: dataUrl })
      }
      reader.onerror = () => {
        alert("Failed to read image file")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setCustomImageUrl("")
    onBackgroundChange({ type: "image", value: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Background Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Background Settings</DialogTitle>
          <DialogDescription>Customize the background of your calendar view</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Background Type Selection */}
          <div className="space-y-2">
            <Label>Background Type</Label>
            <Select value={background.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Solid Color
                  </div>
                </SelectItem>
                <SelectItem value="gradient">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Gradient
                  </div>
                </SelectItem>
                <SelectItem value="image">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Image
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Solid Color Options */}
          {background.type === "solid" && (
            <div className="space-y-4">
              <Label>Color</Label>
              <div className="grid grid-cols-4 gap-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorSelect(color.value)}
                    className={`h-16 rounded-lg border-2 transition-all ${
                      background.value === color.value
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-border hover:border-primary/50"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-color">Custom Color</Label>
                <div className="flex gap-2">
                  <input
                    id="custom-color"
                    type="color"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="h-10 w-20 cursor-pointer rounded border"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Gradient Options */}
          {background.type === "gradient" && (
            <div className="space-y-4">
              <Label>Gradient</Label>
              <div className="grid grid-cols-2 gap-3">
                {PRESET_GRADIENTS.map((gradient) => (
                  <button
                    key={gradient.name}
                    onClick={() => handleGradientSelect(gradient.value)}
                    className={`h-20 rounded-lg border-2 transition-all ${
                      background.value === gradient.value
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-border hover:border-primary/50"
                    }`}
                    style={{ background: gradient.value }}
                    title={gradient.name}
                  >
                    <span className="text-xs font-medium text-white drop-shadow-lg">
                      {gradient.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Options */}
          {background.type === "image" && (
            <div className="space-y-4">
              <Label>Background Image</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileSelect}
                className="hidden"
              />
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUploadClick}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
                {customImageUrl && (
                  <div className="relative group">
                    <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                      <img
                        src={customImageUrl}
                        alt="Background preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove image</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

