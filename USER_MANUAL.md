# DocuMerge — User Manual & Practical Guide

Welcome to **DocuMerge**! This manual explains how to use the app to combine multiple files into clean, professional documents in just a few clicks.

---

## 1. What is DocuMerge?

**DocuMerge** is a modern document utility designed to merge different file types—including PDFs, Excel spreadsheets, scanned images, and plain text notes—into a single combined file.

### Why is DocuMerge Different?
- 🔒 **100% Private**: Traditional merge websites upload your private contracts, statements, or photos to their remote cloud servers. DocuMerge does all the work **directly inside your web browser**. Your files never leave your computer.
- ⚡ **Instant Processing**: Because there are no upload or download queues to an external server, files process virtually instantaneously.
- 🎨 **Clean, Focused Design**: An uncluttered white workspace that makes organizing and merging documents effortless.
- 🆓 **No Watermarks, No Limits**: Merge as many documents as your computer's memory can handle without subscriptions or watermarks.

---

## 2. Supported Formats

| Category | File Extensions | What Happens During Merge |
| :--- | :--- | :--- |
| **PDF Documents** | `.pdf` | Combines all pages from each PDF in the exact order you select. |
| **Spreadsheets** | `.xlsx`, `.xls`, `.csv` | Collects all individual sheets into a single organized Excel workbook. |
| **Images & Scans** | `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif` | Converts and stitches images into multi-page PDF documents. |
| **Text Documents** | `.txt`, `.md` | Appends text into a single document with clear headings. |
| **Mixed Batches** | PDFs + Images + Notes | Assembles diverse files into a unified master PDF. |

---

## 3. How to Use DocuMerge: Step-by-Step

### Step 1: Add Your Files
You have two easy ways to add files:
1. **Drag and Drop**: Simply drag files from your computer's file explorer and drop them anywhere onto the dotted upload box.
2. **File Browser**: Click the **"browse your computer"** link inside the box to open your file selector. You can highlight and select multiple files at once using `Ctrl` or `Shift`.

> **Tip:** You can add more files at any time. New files will be placed at the bottom of the list.

---

### Step 2: Arrange the Order
The order shown in the queue is the exact order in which your document will be assembled (top = first pages, bottom = final pages).

- **Drag to Reorder**: Click and hold the vertical grip icon (`⋮⋮`) to drag a file higher or lower in the list.
- **Arrow Buttons**: Use the **↑** (up) and **↓** (down) arrows next to each document to make step-by-step adjustments.
- **Remove Files**: If you added a file by mistake, click the **✕** button on that file's row.
- **Clear All**: Use the **"Clear all"** link if you want to start fresh with a new batch.

---

### Step 3: Choose Your Merge Strategy
Below your document list, DocuMerge displays strategy cards:

1. **Auto-detect (Default & Recommended)**  
   DocuMerge inspects the files you added and chooses the best approach automatically:
   - If you provide only PDFs $\rightarrow$ produces a combined PDF.
   - If you provide spreadsheets $\rightarrow$ produces a multi-sheet Excel file.
   - If you provide a mixture of PDFs, scans, and notes $\rightarrow$ produces a unified PDF.

2. **Merge PDFs**  
   Specifically merges pure PDF files together.

3. **Merge Spreadsheets**  
   Consolidates Excel tables and CSV exports into a single `.xlsx` workbook, preserving individual worksheets with clear labels.

4. **Images $\rightarrow$ PDF**  
   Perfect for receipts, photo scans, or presentation slides. Each image becomes its own page in the output PDF.

5. **Merge Text**  
   Combines meeting notes, markdown documents, or text snippets into a single document with headers marking where each file begins.

6. **Mixed $\rightarrow$ PDF**  
   Forces all supported formats (PDFs, images, and text) to combine into a master PDF document.

---

### Step 4: Name Your File & Download
1. In the **Output filename** box, type your preferred name (e.g., `Q3-Financial-Report` or `Merged-Application`). You don't need to type the extension like `.pdf`—DocuMerge adds the right one for you.
2. Click **Merge & Download**.
3. Within moments, your newly merged document will automatically download to your browser's default downloads folder!
4. Click **"Merge another batch"** if you have more documents to process.

---

## 4. How It Works Under the Hood (A Quick Technical Note)

While the interface is simple and clean, here is what is actually taking place:

1. **In-Memory File Reading**: When you select a file, your browser loads its binary contents into local RAM (using the browser's standard `ArrayBuffer` API).
2. **Vector & Page Extraction**:
   - For PDFs, our built-in engine reads the internal page tree, extracts vector shapes, fonts, and annotations, and attaches them to a new PDF canvas.
   - For spreadsheets, SheetJS reads binary cells and reconstructs standard OpenXML workbook structures.
3. **No Network Traffic**: If you disconnect your Wi-Fi or turn on Airplane mode after opening the webpage, DocuMerge will still work completely normally!
4. **Instant Disposal**: As soon as your download begins, temporary memory objects are cleared to keep your browser running fast.

---

## 5. Frequently Asked Questions & Troubleshooting

#### Q: Is there a file size limit?
**A:** Because DocuMerge runs inside your browser rather than on a server with artificial quotas, the limit is simply your computer's available memory. For optimal performance, merging 50–100 typical documents or total batches under 300MB is recommended.

#### Q: Are password-protected PDFs supported?
**A:** Encrypted or password-protected PDFs cannot be read without the decryption key. Please remove passwords from protected PDFs before adding them to the merge queue.

#### Q: Can I merge Word (`.docx`) files directly with PDFs?
**A:** For the best visual fidelity, we recommend saving your Word document as a PDF first (`File > Save As > PDF`), then adding it to DocuMerge. This ensures all your custom fonts, margins, and layouts look identical.

#### Q: What browser is recommended?
**A:** DocuMerge works on all modern web browsers that support modern web standards, including Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, and Brave.
