"use client";

import { useEffect, useState } from "react";
import { Button, Modal, message } from "antd";
import {
  CopyOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./richTextEditorModal.css";
import { useEditor } from "@tiptap/react";
import Typography from "@tiptap/extension-typography";
import { motion } from "framer-motion";
import markdownit from "markdown-it";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import EditorMenuControls from "./MenuControls";
import {
  FontSize,
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  RichTextEditorProvider,
  RichTextField,
} from "mui-tiptap";
import FontFamily from "@tiptap/extension-font-family";

const md = new markdownit();

const formatPlainText = (text: string) => {
  //format only if not already formatted
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html");
  const validHtml =
    doc.body?.childNodes &&
    Array.from(doc.body?.childNodes).some((node) => node?.nodeType === 1); // rudimentary check for valid HTML
  if (validHtml) {
    return text;
  }
  return md.render(text);
};

const CustomLinkExtension = Link.extend({
  inclusive: false,
});

export default function RichTextEditorModal({
  initialText,
  saveToDb,
  title,
}: {
  initialText: string;
  saveToDb: (content: string) => Promise<void>;
  title: string;
}) {
  const [content, setContent] = useState(formatPlainText(initialText));
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor(
    {
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none flex-grow w-full h-full",
        },
      },
      parseOptions: { preserveWhitespace: "full" },
      extensions: [
        StarterKit,
        Typography,
        TextStyle,
        CustomLinkExtension.configure({
          autolink: true,
          linkOnPaste: true,
          openOnClick: false,
        }),
        LinkBubbleMenuHandler,
        FontFamily,
        FontSize,
      ],
      onUpdate: ({ editor }) => {},
    },
    [isEditing]
  );

  useEffect(() => {
    setContent(formatPlainText(initialText));
  }, [initialText]);

  useEffect(() => {
    editor?.setEditable(isEditing);
  }, [isEditing, editor]);

  useEffect(() => {
    editor?.commands.setContent(content, false, { preserveWhitespace: "full" }); // Ensure content is set when opening modal
  }, [content, editor]);

  const handleCopy = async () => {
    try {
      if (!editor) return;
      // Create a new clipboard item
      const clipboardItem = new ClipboardItem({
        "text/html": new Blob([editor?.getHTML()], { type: "text/html" }), // Content with HTML formatting
        "text/plain": new Blob([editor.getText()], { type: "text/plain" }), // Plain text fallback
      });
      await navigator.clipboard.write([clipboardItem]);
      message.success("Copied to clipboard!");
    } catch (err) {
      message.error("Failed to copy.");
    }
  };

  const onSave = async () => {
    setIsEditing(false);
    try {
      if (editor) {
        setContent(editor.getHTML());
        await saveToDb(editor.getHTML());
      }
    } catch (err) {
      message.error("Failed to save. Try again later.");
    }
  };

  if (!editor?.isInitialized && !isEditing) return <></>;

  return (
    <div className="flex justify-center w-full h-full bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative w-full p-4"
      >
        <div className="h-full">
          {!isEditing && (
            <RichTextEditorProvider editor={editor}>
              <RichTextField
                RichTextContentProps={{ className: "text-editor" }}
                className="text-editor-container"
              />
            </RichTextEditorProvider>
          )}
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: -10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.1, ease: "easeOut" },
            },
          }}
          className="absolute top-5 right-5 flex space-x-2"
        >
          <motion.div
            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          >
            <Button icon={<CopyOutlined />} onClick={handleCopy} />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          >
            <Button
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {isEditing && (
        <Modal
          open={isEditing}
          destroyOnClose={false}
          title={title}
          onCancel={() => setIsEditing(false)}
          footer={[
            <Button
              key={"cancel"}
              icon={<CloseOutlined />}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>,
            <Button
              key={"save"}
              type="primary"
              icon={<SaveOutlined />}
              disabled={!editor}
              onClick={onSave}
            >
              Save
            </Button>,
          ]}
          width="80%"
          style={{ height: "80vh", top: "2vh" }}
          styles={{
            body: {
              height: "80vh",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border p-2 h-[100%]"
          >
            <RichTextEditorProvider editor={editor}>
              <RichTextField
                RichTextContentProps={{
                  className: "text-editor editor-control-menu",
                }}
                className="text-editor-container"
                controls={<EditorMenuControls />}
              />
              <LinkBubbleMenu />
            </RichTextEditorProvider>
          </motion.div>
        </Modal>
      )}
    </div>
  );
}
