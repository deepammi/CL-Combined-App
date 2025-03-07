"use client";
import {
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonEditLink,
  MenuButtonIndent,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonStrikethrough,
  MenuButtonUndo,
  MenuButtonUnindent,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectFontFamily,
  MenuSelectFontSize,
  MenuSelectHeading,
  isTouchDevice,
} from "mui-tiptap";

export default function EditorMenuControls() {
  return (
    <MenuControlsContainer>
      <MenuSelectFontFamily
        options={[
          { label: "Verdana", value: "Verdana" },
          { label: "Arial", value: "Arial" },
          { label: "Georgia", value: "Georgia" },
          { label: "Times New Roman", value: "Times New Roman" },
          { label: "Courier New", value: "Courier New" },
          { label: "Helvetica", value: "Helvetica" },
          { label: "Cursive", value: "cursive" },
          { label: "Monospace", value: "monospace" },
          { label: "Serif", value: "serif" },
          { label: "Sans-serif", value: "sans-serif" },
        ]}
      />

      <MenuDivider />

      <MenuSelectHeading />

      <MenuDivider />

      <MenuSelectFontSize />

      <MenuDivider />

      <MenuButtonBold />

      <MenuButtonItalic />

      <MenuButtonStrikethrough />

      <MenuDivider />

      <MenuButtonEditLink />

      <MenuDivider />

      <MenuButtonOrderedList />

      <MenuButtonBulletedList />

      {isTouchDevice() && (
        <>
          <MenuButtonIndent />

          <MenuButtonUnindent />
        </>
      )}

      <MenuDivider />

      <MenuButtonBlockquote />

      <MenuDivider />

      <MenuButtonCode />

      <MenuButtonCodeBlock />

      <MenuDivider />

      <MenuButtonUndo />
      <MenuButtonRedo />
      
    </MenuControlsContainer>
  );
}
