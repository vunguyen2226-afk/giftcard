"use client"

import { useReducer, useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { EditorState, FontFamily, EffectType } from "@/types"
import { StepIndicator } from "@/components/card-editor/step-indicator"
import { TemplateSelector } from "@/components/card-editor/template-selector"
import { MessageEditor } from "@/components/card-editor/message-editor"
import { FontPicker } from "@/components/card-editor/font-picker"
import { ColorPicker } from "@/components/card-editor/color-picker"
import { EffectSelector } from "@/components/card-editor/effect-selector"
import { ImageUploader } from "@/components/card-editor/image-uploader"
import { MusicSelector } from "@/components/card-editor/music-selector"
import { BackgroundPicker } from "@/components/card-editor/background-picker"
import { RecipientManager } from "@/components/card-editor/recipient-manager"
import { CardPreview } from "@/components/card-editor/card-preview"
import { getTemplateComponent } from "@/templates"
import { useTranslation } from "@/lib/i18n"

// Action types
type EditorAction =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_TEMPLATE"; templateId: string; defaultColor: string; defaultFont: FontFamily; defaultImage?: string }
  | { type: "SET_SENDER_NAME"; name: string }
  | { type: "SET_MESSAGE"; message: string }
  | { type: "SET_FONT"; font: FontFamily }
  | { type: "SET_COLOR"; color: string }
  | { type: "SET_EFFECT"; effect: EffectType }
  | { type: "SET_IMAGE"; imageUrl: string | undefined }
  | { type: "SET_MUSIC"; musicUrl: string | undefined }
  | { type: "SET_BACKGROUND_PRESET"; backgroundPresetId: string | undefined }
  | { type: "ADD_RECIPIENT"; name: string; email?: string }
  | { type: "REMOVE_RECIPIENT"; index: number }
  | { type: "BULK_ADD_RECIPIENTS"; recipients: { name: string; email?: string }[] }

// Reducer
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step }
    case "SET_TEMPLATE":
      return {
        ...state,
        templateId: action.templateId,
        primaryColor: action.defaultColor,
        fontFamily: action.defaultFont,
        imageUrl: action.defaultImage,
      }
    case "SET_SENDER_NAME":
      return { ...state, senderName: action.name }
    case "SET_MESSAGE":
      return { ...state, message: action.message }
    case "SET_FONT":
      return { ...state, fontFamily: action.font }
    case "SET_COLOR":
      return { ...state, primaryColor: action.color }
    case "SET_EFFECT":
      return { ...state, effect: action.effect }
    case "SET_IMAGE":
      return { ...state, imageUrl: action.imageUrl }
    case "SET_MUSIC":
      return { ...state, backgroundMusic: action.musicUrl }
    case "SET_BACKGROUND_PRESET":
      return { ...state, backgroundPresetId: action.backgroundPresetId }
    case "ADD_RECIPIENT":
      return {
        ...state,
        recipientNames: [...state.recipientNames, action.name],
        recipientEmails: [...state.recipientEmails, action.email || ""],
      }
    case "REMOVE_RECIPIENT":
      return {
        ...state,
        recipientNames: state.recipientNames.filter((_, i) => i !== action.index),
        recipientEmails: state.recipientEmails.filter((_, i) => i !== action.index),
      }
    case "BULK_ADD_RECIPIENTS":
      return {
        ...state,
        recipientNames: [
          ...state.recipientNames,
          ...action.recipients.map((r) => r.name),
        ],
        recipientEmails: [
          ...state.recipientEmails,
          ...action.recipients.map((r) => r.email || ""),
        ],
      }
    default:
      return state
  }
}

export default function CreateCardPage() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const [showPreview, setShowPreview] = useState(false)

  const STEPS = [t.editor.steps.template, t.editor.steps.customize, t.editor.steps.recipients, t.editor.steps.previewSend]

  const initialState: EditorState = {
    step: 1,
    templateId: "traditional",
    senderName: session?.user?.name || "",
    recipientNames: [],
    recipientEmails: [],
    message: "",
    fontFamily: "serif",
    primaryColor: "#dc2626",
    effect: "confetti",
  }

  const [state, dispatch] = useReducer(editorReducer, initialState)

  // Auto-fill sender name from session
  useEffect(() => {
    if (session?.user?.name && !state.senderName) {
      dispatch({ type: "SET_SENDER_NAME", name: session.user.name })
    }
  }, [session, state.senderName])

  // Validation functions
  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!state.templateId
      case 2:
        return !!state.senderName.trim() && !!state.message.trim() && state.message.length <= 500
      case 3:
        return state.recipientNames.length > 0 && state.recipientNames.length <= 50
      case 4:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceedFromStep(state.step) && state.step < 4) {
      dispatch({ type: "SET_STEP", step: state.step + 1 })
    }
  }

  const handleBack = () => {
    if (state.step > 1) {
      dispatch({ type: "SET_STEP", step: state.step - 1 })
    }
  }

  const handleStepClick = (step: number) => {
    if (step < state.step) {
      dispatch({ type: "SET_STEP", step })
    }
  }

  // Get template component for preview
  const TemplateComponent = useMemo(
    () => getTemplateComponent(state.templateId),
    [state.templateId]
  )

  return (
    <div className="min-h-screen pb-8">
      {/* Desktop: 2-column layout */}
      <div className="hidden lg:grid lg:grid-cols-[60%_40%] lg:gap-8 lg:h-[calc(100vh-8rem)]">
        {/* Left: Editor */}
        <div className="overflow-y-auto pr-4">
          <StepIndicator currentStep={state.step} steps={STEPS} onStepClick={handleStepClick} />

          <div className="space-y-8">
            {/* Step 1: Template */}
            {state.step === 1 && (
              <TemplateSelector
                selectedTemplateId={state.templateId}
                onSelect={(id, color, font, image) =>
                  dispatch({ type: "SET_TEMPLATE", templateId: id, defaultColor: color, defaultFont: font as FontFamily, defaultImage: image })
                }
              />
            )}

            {/* Step 2: Customize */}
            {state.step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.editor.customizeTitle}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {t.editor.customizeSubtitle}
                  </p>
                </div>

                <MessageEditor
                  senderName={state.senderName}
                  message={state.message}
                  onSenderNameChange={(name) => dispatch({ type: "SET_SENDER_NAME", name })}
                  onMessageChange={(message) => dispatch({ type: "SET_MESSAGE", message })}
                />

                <FontPicker
                  selectedFont={state.fontFamily}
                  onSelect={(font) => dispatch({ type: "SET_FONT", font })}
                />

                <ColorPicker
                  selectedColor={state.primaryColor}
                  onSelect={(color) => dispatch({ type: "SET_COLOR", color })}
                />

                <BackgroundPicker
                  selectedBackground={state.backgroundPresetId}
                  onSelect={(id) => dispatch({ type: "SET_BACKGROUND_PRESET", backgroundPresetId: id })}
                />

                <EffectSelector
                  selectedEffect={state.effect}
                  onSelect={(effect) => dispatch({ type: "SET_EFFECT", effect })}
                />

                <ImageUploader
                  imageUrl={state.imageUrl}
                  onUpload={(url) => dispatch({ type: "SET_IMAGE", imageUrl: url })}
                  onRemove={() => dispatch({ type: "SET_IMAGE", imageUrl: undefined })}
                />

                <MusicSelector
                  selectedMusic={state.backgroundMusic}
                  onSelect={(url) => dispatch({ type: "SET_MUSIC", musicUrl: url })}
                />
              </div>
            )}

            {/* Step 3: Recipients */}
            {state.step === 3 && (
              <RecipientManager
                recipients={state.recipientNames.map((name, i) => ({
                  name,
                  email: state.recipientEmails[i] || undefined,
                }))}
                onAdd={(recipient) =>
                  dispatch({ type: "ADD_RECIPIENT", name: recipient.name, email: recipient.email })
                }
                onRemove={(index) => dispatch({ type: "REMOVE_RECIPIENT", index })}
                onBulkAdd={(recipients) => dispatch({ type: "BULK_ADD_RECIPIENTS", recipients })}
              />
            )}

            {/* Step 4: Preview */}
            {state.step === 4 && <CardPreview editorState={state} />}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleBack}
                disabled={state.step === 1}
                className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
                         rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t.common.back}
              </button>

              {state.step < 4 && (
                <button
                  onClick={handleNext}
                  disabled={!canProceedFromStep(state.step)}
                  className="px-6 py-2 bg-rose-600 text-white rounded-lg font-medium
                           hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
                >
                  {t.common.next}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="sticky top-0 h-full overflow-y-auto pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.editor.livePreview}</h3>
            <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
              <div className="aspect-[4/3] flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800">
                {state.templateId ? (
                  <div className="w-full transform scale-75">
                    <TemplateComponent
                      senderName={state.senderName || t.editor.yourName}
                      recipientName={state.recipientNames[0] || t.editor.recipient}
                      message={state.message || t.editor.messagePlaceholder}
                      fontFamily={state.fontFamily}
                      primaryColor={state.primaryColor}
                      imageUrl={state.imageUrl}
                      backgroundPresetId={state.backgroundPresetId}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">{t.editor.selectTemplate}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Single column with preview toggle */}
      <div className="lg:hidden space-y-6">
        <StepIndicator currentStep={state.step} steps={STEPS} onStepClick={handleStepClick} />

        {/* Preview Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(false)}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              !showPreview
                ? "bg-rose-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {t.common.edit}
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              showPreview
                ? "bg-rose-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {t.common.preview}
          </button>
        </div>

        {/* Content */}
        {showPreview ? (
          <div className="rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
            <div className="aspect-[4/3] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800">
              {state.templateId ? (
                <div className="w-full transform scale-75">
                  <TemplateComponent
                    senderName={state.senderName || t.editor.yourName}
                    recipientName={state.recipientNames[0] || t.editor.recipient}
                    message={state.message || t.editor.messagePlaceholder}
                    fontFamily={state.fontFamily}
                    primaryColor={state.primaryColor}
                    imageUrl={state.imageUrl}
                  />
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">{t.editor.selectTemplate}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {state.step === 1 && (
              <TemplateSelector
                selectedTemplateId={state.templateId}
                onSelect={(id, color, font, image) =>
                  dispatch({ type: "SET_TEMPLATE", templateId: id, defaultColor: color, defaultFont: font as FontFamily, defaultImage: image })
                }
              />
            )}

            {state.step === 2 && (
              <div className="space-y-6">
                <MessageEditor
                  senderName={state.senderName}
                  message={state.message}
                  onSenderNameChange={(name) => dispatch({ type: "SET_SENDER_NAME", name })}
                  onMessageChange={(message) => dispatch({ type: "SET_MESSAGE", message })}
                />
                <FontPicker
                  selectedFont={state.fontFamily}
                  onSelect={(font) => dispatch({ type: "SET_FONT", font })}
                />
                <ColorPicker
                  selectedColor={state.primaryColor}
                  onSelect={(color) => dispatch({ type: "SET_COLOR", color })}
                />
                <BackgroundPicker
                  selectedBackground={state.backgroundPresetId}
                  onSelect={(id) => dispatch({ type: "SET_BACKGROUND_PRESET", backgroundPresetId: id })}
                />
                <EffectSelector
                  selectedEffect={state.effect}
                  onSelect={(effect) => dispatch({ type: "SET_EFFECT", effect })}
                />
                <ImageUploader
                  imageUrl={state.imageUrl}
                  onUpload={(url) => dispatch({ type: "SET_IMAGE", imageUrl: url })}
                  onRemove={() => dispatch({ type: "SET_IMAGE", imageUrl: undefined })}
                />
                <MusicSelector
                  selectedMusic={state.backgroundMusic}
                  onSelect={(url) => dispatch({ type: "SET_MUSIC", musicUrl: url })}
                />
              </div>
            )}

            {state.step === 3 && (
              <RecipientManager
                recipients={state.recipientNames.map((name, i) => ({
                  name,
                  email: state.recipientEmails[i] || undefined,
                }))}
                onAdd={(recipient) =>
                  dispatch({ type: "ADD_RECIPIENT", name: recipient.name, email: recipient.email })
                }
                onRemove={(index) => dispatch({ type: "REMOVE_RECIPIENT", index })}
                onBulkAdd={(recipients) => dispatch({ type: "BULK_ADD_RECIPIENTS", recipients })}
              />
            )}

            {state.step === 4 && <CardPreview editorState={state} />}
          </div>
        )}

        {/* Navigation */}
        {!showPreview && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              disabled={state.step === 1}
              className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
                       rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {t.common.back}
            </button>

            {state.step < 4 && (
              <button
                onClick={handleNext}
                disabled={!canProceedFromStep(state.step)}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg font-medium
                         hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
              >
                {t.common.next}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
