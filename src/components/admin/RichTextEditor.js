// src/components/admin/RichTextEditor.js

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { useCallback, useRef, useState, useEffect } from 'react';

export default function RichTextEditor({ content, onChange }) {
  const [isMounted, setIsMounted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageWidth, setImageWidth] = useState('');
  const [imageHeight, setImageHeight] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  const addImageUrl = useCallback(() => {
    setShowImageModal(true);
    setImageUrl('');
    setImageWidth('');
    setImageHeight('');
  }, []);

  const insertImage = useCallback(() => {
    if (imageUrl && editor) {
      const attrs = { src: imageUrl };
      if (imageWidth) attrs.width = imageWidth;
      if (imageHeight) attrs.height = imageHeight;

      editor.chain().focus().setImage(attrs).run();
      setShowImageModal(false);
      setImageUrl('');
      setImageWidth('');
      setImageHeight('');
    }
  }, [editor, imageUrl, imageWidth, imageHeight]);

  const uploadImage = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result;
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      };
      reader.readAsDataURL(file);
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!isMounted || !editor) {
    return (
      <div style={styles.editorContainer}>
        <div style={styles.toolbar}>
          <div style={{ padding: '8px', color: '#9ca3af', fontSize: '14px' }}>
            Loading editor...
          </div>
        </div>
        <div style={styles.editorContent}>
          <div style={{ padding: '16px', color: '#9ca3af' }}>
            Initializing...
          </div>
        </div>
      </div>
    );
  }

  const isTableActive = editor.isActive('table');

  return (
    <div style={styles.editorContainer}>
      {/* Image Modal */}
      {showImageModal && (
        <div style={styles.modalOverlay} onClick={() => setShowImageModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Insert Image</h3>
            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.modalLabel}>Image URL *</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={styles.modalInput}
                  autoFocus
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.modalLabel}>Width (optional)</label>
                  <input
                    type="text"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(e.target.value)}
                    placeholder="e.g., 300px or 50%"
                    style={styles.modalInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.modalLabel}>Height (optional)</label>
                  <input
                    type="text"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(e.target.value)}
                    placeholder="e.g., 200px or auto"
                    style={styles.modalInput}
                  />
                </div>
              </div>
            </div>
            <div style={styles.modalActions}>
              <button
                onClick={() => setShowImageModal(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={insertImage}
                style={styles.insertButton}
                disabled={!imageUrl}
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={styles.toolbar}>
        {/* Text Formatting */}
        <div style={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive('bold') ? '#e5e7eb' : 'transparent'
            }}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive('italic') ? '#e5e7eb' : 'transparent'
            }}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive('underline') ? '#e5e7eb' : 'transparent'
            }}
            title="Underline"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive('strike') ? '#e5e7eb' : 'transparent'
            }}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        <div style={styles.divider}></div>

        {/* Headings */}
        <div style={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive('heading', { level: 1 }) ? '#e5e7eb' : 'transparent'
            }}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive('heading', { level: 2 }) ? '#e5e7eb' : 'transparent'
            }}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive('heading', { level: 3 }) ? '#e5e7eb' : 'transparent'
            }}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        <div style={styles.divider}></div>

        {/* Lists */}
        <div style={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive('bulletList') ? '#e5e7eb' : 'transparent'
            }}
            title="Bullet List"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive('orderedList') ? '#e5e7eb' : 'transparent'
            }}
            title="Numbered List"
          >
            1.
          </button>
        </div>

        <div style={styles.divider}></div>

        {/* Alignment */}
        <div style={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive({ textAlign: 'left' }) ? '#e5e7eb' : 'transparent'
            }}
            title="Align Left"
          >
            ⬅
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive({ textAlign: 'center' }) ? '#e5e7eb' : 'transparent'
            }}
            title="Align Center"
          >
            ⬌
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive({ textAlign: 'right' }) ? '#e5e7eb' : 'transparent'
            }}
            title="Align Right"
          >
            ➡
          </button>
        </div>

        <div style={styles.divider}></div>

        {/* Link & Images */}
        <div style={styles.toolbarGroup}>
          <button
            type="button"
            onClick={setLink}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive('link') ? '#e5e7eb' : 'transparent'
            }}
            title="Add Link"
          >
            🔗
          </button>
          <button
            type="button"
            onClick={addImageUrl}
            style={styles.toolbarButton}
            title="Add Image URL"
          >
            🖼️
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={styles.toolbarButton}
            title="Upload Image"
          >
            📤
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={uploadImage}
            style={{ display: 'none' }}
          />
        </div>

        <div style={styles.divider}></div>

        {/* Table Controls */}
        <div style={styles.toolbarGroup}>
          <button
            type="button"
            onClick={addTable}
            style={{
              ...styles.toolbarButton,
              backgroundColor: isTableActive ? '#e5e7eb' : 'transparent'
            }}
            title="Insert Table"
          >
            ⊞
          </button>
          {isTableActive && (
            <>
              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                style={styles.toolbarButton}
                title="Add Column Before"
              >
                ←+
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                style={styles.toolbarButton}
                title="Add Column After"
              >
                +→
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteColumn().run()}
                style={styles.toolbarButton}
                title="Delete Column"
              >
                ↕✕
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addRowBefore().run()}
                style={styles.toolbarButton}
                title="Add Row Before"
              >
                ↑+
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                style={styles.toolbarButton}
                title="Add Row After"
              >
                +↓
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteRow().run()}
                style={styles.toolbarButton}
                title="Delete Row"
              >
                ↔✕
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteTable().run()}
                style={styles.toolbarButton}
                title="Delete Table"
              >
                ⊞✕
              </button>
            </>
          )}
        </div>

        <div style={styles.divider}></div>

        {/* Other */}
        <div style={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive('blockquote') ? '#e5e7eb' : 'transparent'
            }}
            title="Blockquote"
          >
            "
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            style={{
              ...styles.toolbarButton,
              backgroundColor: editor.isActive('codeBlock') ? '#e5e7eb' : 'transparent'
            }}
            title="Code Block"
          >
            {'</>'}
          </button>
        </div>

        <div style={styles.divider}></div>

        {/* Undo/Redo */}
        <div style={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            style={{
              ...styles.toolbarButton,
              opacity: editor.can().undo() ? 1 : 0.5,
              cursor: editor.can().undo() ? 'pointer' : 'not-allowed'
            }}
            title="Undo"
          >
            ↶
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            style={{
              ...styles.toolbarButton,
              opacity: editor.can().redo() ? 1 : 0.5,
              cursor: editor.can().redo() ? 'pointer' : 'not-allowed'
            }}
            title="Redo"
          >
            ↷
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div style={styles.editorContent}>
        <EditorContent editor={editor} />
      </div>

      {/* Global Styles for Editor */}
      <style jsx global>{`
        .ProseMirror {
          min-height: 300px;
          padding: 16px;
          outline: none;
        }

        .ProseMirror p {
          margin: 0.5em 0;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }

        .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 2em;
          margin: 0.5em 0;
        }

        .ProseMirror blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          color: #6b7280;
        }

        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
        }

        .ProseMirror pre {
          background-color: #1f2937;
          color: #f3f4f6;
          padding: 1em;
          border-radius: 6px;
          overflow-x: auto;
          margin: 1em 0;
        }

        .ProseMirror pre code {
          background: none;
          padding: 0;
          color: inherit;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          margin: 0.5em 0;
          cursor: pointer;
        }

        .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
          overflow: hidden;
        }

        .ProseMirror th,
        .ProseMirror td {
          border: 1px solid #e5e7eb;
          padding: 0.5em;
          text-align: left;
          position: relative;
        }

        .ProseMirror th {
          background-color: #f3f4f6;
          font-weight: bold;
        }

        .ProseMirror .selectedCell {
          background-color: #dbeafe;
        }

        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

const styles = {
  editorContainer: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'white'
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    padding: '8px',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb'
  },
  toolbarGroup: {
    display: 'flex',
    gap: '2px'
  },
  toolbarButton: {
    padding: '6px 10px',
    border: '1px solid transparent',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px',
    color: '#374151'
  },
  divider: {
    width: '1px',
    backgroundColor: '#e5e7eb',
    margin: '0 4px'
  },
  editorContent: {
    backgroundColor: 'white',
    minHeight: '300px',
    maxHeight: '600px',
    overflowY: 'auto'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1f2937'
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1
  },
  formRow: {
    display: 'flex',
    gap: '12px'
  },
  modalLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  modalInput: {
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none'
  },
  modalActions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  insertButton: {
    padding: '8px 16px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  }
};