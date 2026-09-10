import { useMemo } from "react";
import JoditEditor from "jodit-react";
import "./RichTextEditor.css";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  minHeight?: number;
}

export function isRichTextEmpty(html?: string): boolean {
  if (!html) return true;
  const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
  return !text;
}

export default function RichTextEditor({
  value,
  onChange,
  disabled,
  placeholder = "Start writing…",
  minHeight = 360,
}: RichTextEditorProps) {
  const config = useMemo(
    () => ({
      readonly: disabled,
      placeholder,
      height: minHeight,
      minHeight: 280,
      toolbar: true,
      toolbarAdaptive: true,
      toolbarSticky: true,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      statusbar: true,
      allowResizeY: true,
      spellcheck: true,
      enableDragAndDropFileToEditor: true,
      askBeforePasteHTML: false,
      processPasteFromWord: true,
      defaultActionOnPaste: "insert_as_html" as const,
      disablePlugins: ["ai-assistant", "speech-recognize"],
      uploader: {
        insertImageAsBase64URI: true,
        imagesExtensions: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
      },
      image: {
        editSrc: true,
        useImageEditor: true,
      },
      link: {
        followOnDblClick: false,
        openInNewTabCheckbox: true,
      },
      tableAllowCellResize: true,
    }),
    [disabled, placeholder, minHeight],
  );

  return (
    <div className={`rich-text-editor${disabled ? " rich-text-editor--disabled" : ""}`}>
      <JoditEditor value={value ?? ""} config={config} onChange={onChange} />
    </div>
  );
}
