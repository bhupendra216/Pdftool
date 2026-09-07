export const toolContent = {
  'merge-pdf': {
    howToSteps: [
      { title: 'Upload Your PDFs', description: 'Drag and drop or click to upload up to 20 PDF files.', icon: 'Upload' },
      { title: 'Arrange Order', description: 'Drag to reorder files and preview the final sequence before merging.', icon: 'Move' },
      { title: 'Merge & Download', description: 'Click Merge PDF and download your combined file instantly.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Up to 20 Files', description: 'Combine multiple PDFs in one clean workflow.' },
      { icon: 'ShieldCheck', title: 'Privacy First', description: 'Files stay secure and your workflow stays private.' },
      { icon: 'Clock3', title: 'Fast Results', description: 'Most merges finish in a few seconds.' },
      { icon: 'Smartphone', title: 'All Devices', description: 'Works on desktop, tablet, and phone.' },
    ],
    useCases: [
      { title: 'Job Applications', description: 'Combine resume, cover letter, and portfolio in one PDF.', audience: 'Job Seekers' },
      { title: 'Tax Documents', description: 'Merge receipts, forms, and statements for organized filing.', audience: 'Small Business' },
      { title: 'Research Papers', description: 'Bundle chapters, references, and appendices into one file.', audience: 'Students' },
    ],
    relatedTools: ['split-pdf', 'compress-pdf', 'reorder-pages', 'pdf-to-word'],
  },
  'split-pdf': {
    howToSteps: [
      { title: 'Upload Your PDF', description: 'Choose the PDF file you want to split into pages or ranges.', icon: 'Upload' },
      { title: 'Select Page Range', description: 'Choose the exact pages, ranges, or individual pages to extract.', icon: 'Move' },
      { title: 'Split & Save', description: 'Create your new file and download it instantly.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Custom Ranges', description: 'Split by exact page numbers or a custom range.' },
      { icon: 'ShieldCheck', title: 'Clear Output', description: 'Keep the original file and create a new split version.' },
      { icon: 'Clock3', title: 'Quick Process', description: 'Extract pages without slow desktop software.' },
      { icon: 'Smartphone', title: 'No Setup', description: 'Use directly in your browser from any device.' },
    ],
    useCases: [
      { title: 'Invoices', description: 'Split statements and billing pages from a larger PDF.', audience: 'Accountants' },
      { title: 'Class Notes', description: 'Extract just the module pages you need to study.', audience: 'Students' },
      { title: 'Contracts', description: 'Pull the relevant agreement pages into a clean one-page handoff.', audience: 'Teams' },
    ],
    relatedTools: ['merge-pdf', 'reorder-pages', 'compress-pdf', 'pdf-to-word'],
  },
  'compress-pdf': {
    howToSteps: [
      { title: 'Upload PDF', description: 'Choose the document you want to shrink for sharing or email.', icon: 'Upload' },
      { title: 'Set Compression', description: 'Use the quality settings that best fit your document and size goal.', icon: 'Wand2' },
      { title: 'Download Smaller File', description: 'Save the optimized PDF and share it faster.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Smaller Files', description: 'Reduce PDF size dramatically for faster sharing.' },
      { icon: 'ShieldCheck', title: 'Readable Output', description: 'Maintain clarity while reducing bulk.' },
      { icon: 'Clock3', title: 'No Waiting', description: 'Most files compress in seconds.' },
      { icon: 'Smartphone', title: 'Works Anywhere', description: 'Responsive design for desktop and mobile.' },
    ],
    useCases: [
      { title: 'Email Attachments', description: 'Send large invoices and reports through small mailbox limits.', audience: 'Professionals' },
      { title: 'University Applications', description: 'Reduce forms to fit upload requirements without losing readability.', audience: 'Students' },
      { title: 'Client Files', description: 'Create lighter file shares for immediate feedback or review.', audience: 'Teams' },
    ],
    relatedTools: ['merge-pdf', 'pdf-to-images', 'pdf-to-word', 'split-pdf'],
  },
  'pdf-to-word': {
    howToSteps: [
      { title: 'Upload PDF', description: 'Upload the PDF you want to convert into editable text.', icon: 'Upload' },
      { title: 'Convert to Word', description: 'Choose the conversion settings and let the tool process it.', icon: 'Wand2' },
      { title: 'Edit & Download', description: 'Open the DOCX and continue editing in Word.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Editable Output', description: 'Turn PDFs into docx files ready for edits.' },
      { icon: 'ShieldCheck', title: 'Layout Retention', description: 'Keep formatting close to the original where possible.' },
      { icon: 'Clock3', title: 'Fast Turnaround', description: 'Get your document back quickly.' },
      { icon: 'Smartphone', title: 'Easy Access', description: 'Convert on mobile, tablet, or laptop.' },
    ],
    useCases: [
      { title: 'Contracts', description: 'Edit clause language and revise agreements without retyping the whole document.', audience: 'Legal Teams' },
      { title: 'Reports', description: 'Turn annual reports into editable file formats for updates.', audience: 'Business Owners' },
      { title: 'Assignments', description: 'Convert a reference PDF into a Word file for notes and edits.', audience: 'Students' },
    ],
    relatedTools: ['word-to-pdf', 'pdf-to-excel', 'pdf-to-powerpoint', 'compress-pdf'],
  },
  'word-to-pdf': {
    howToSteps: [
      { title: 'Upload DOCX', description: 'Choose the Word file you want to convert to PDF.', icon: 'Upload' },
      { title: 'Convert File', description: 'Keep the formatting and generate a polished PDF version.', icon: 'Wand2' },
      { title: 'Save & Share', description: 'Download the final PDF for sending, printing, or archiving.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Clean PDF Output', description: 'Keep layout and formatting polished for sharing.' },
      { icon: 'ShieldCheck', title: 'Secure Delivery', description: 'Simple browser workflow with no confusion.' },
      { icon: 'Clock3', title: 'Quick File Turnaround', description: 'Most conversions happen in seconds.' },
      { icon: 'Smartphone', title: 'Cross-device', description: 'Works on every modern browser.' },
    ],
    useCases: [
      { title: 'Resumes', description: 'Turn a Word resume into a share-ready PDF.', audience: 'Job Seekers' },
      { title: 'Proposals', description: 'Convert client proposals into a fixed layout for printing.', audience: 'Agencies' },
      { title: 'Reports', description: 'Share final versions as a locked format for easy delivery.', audience: 'Teams' },
    ],
    relatedTools: ['pdf-to-word', 'excel-to-pdf', 'powerpoint-to-pdf', 'compress-pdf'],
  },
  'pdf-to-excel': {
    howToSteps: [
      { title: 'Upload PDF', description: 'Select your PDF with tables, lists, or financial data.', icon: 'Upload' },
      { title: 'Convert Table Data', description: 'Extract your rows and columns into spreadsheet-friendly output.', icon: 'Wand2' },
      { title: 'Download Excel', description: 'Get the spreadsheet and continue working in Excel.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Table Extraction', description: 'Convert data-heavy PDFs into clean spreadsheet rows.' },
      { icon: 'ShieldCheck', title: 'Readable Output', description: 'Keep values organized and easy to work with.' },
      { icon: 'Clock3', title: 'Fast Data Recovery', description: 'Move from PDF to spreadsheet in seconds.' },
      { icon: 'Smartphone', title: 'Reliable Browser Workflow', description: 'Works across screens.' },
    ],
    useCases: [
      { title: 'Budgets', description: 'Turn PDF reports into spreadsheet tables for analysis.', audience: 'Finance Teams' },
      { title: 'Invoices', description: 'Extract line items and totals for easy reconciliation.', audience: 'Bookkeepers' },
      { title: 'Data Cleanup', description: 'Move table information from static documents into Excel.', audience: 'Analysts' },
    ],
    relatedTools: ['excel-to-pdf', 'pdf-to-word', 'compress-pdf', 'pdf-to-text'],
  },
  'excel-to-pdf': {
    howToSteps: [
      { title: 'Upload Spreadsheet', description: 'Choose the XLSX or spreadsheet file you want to convert to PDF.', icon: 'Upload' },
      { title: 'Adjust Layout', description: 'Keep the sheet readable and ready for printing or sharing.', icon: 'Wand2' },
      { title: 'Download PDF', description: 'Save your spreadsheet as a clean, share-ready PDF.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Layout Preserved', description: 'Keep the spreadsheet readable in final PDF format.' },
      { icon: 'ShieldCheck', title: 'Print-Ready', description: 'Good for sharing and presentation.' },
      { icon: 'Clock3', title: 'Fast Conversion', description: 'Get a PDF in just a few steps.' },
      { icon: 'Smartphone', title: 'Accessible', description: 'Works on all modern devices.' },
    ],
    useCases: [
      { title: 'Financial Reports', description: 'Share final spreadsheet summaries in a clean PDF format.', audience: 'Finance Teams' },
      { title: 'Client Delivery', description: 'Send numbers to clients as a professional, read-only view.', audience: 'Agencies' },
      { title: 'Inventory', description: 'Archive stock lists and updates in a secure PDF format.', audience: 'Retail Owners' },
    ],
    relatedTools: ['pdf-to-excel', 'word-to-pdf', 'powerpoint-to-pdf', 'compress-pdf'],
  },
  'pdf-to-powerpoint': {
    howToSteps: [
      { title: 'Upload PDF', description: 'Choose a deck or report you want to turn into slides.', icon: 'Upload' },
      { title: 'Convert to Slides', description: 'Prepare the file for shape-based PowerPoint output.', icon: 'Wand2' },
      { title: 'Download PPTX', description: 'Edit and present your slides in PowerPoint.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Presentation Ready', description: 'Turn documents into presentation-friendly PowerPoint files.' },
      { icon: 'ShieldCheck', title: 'Simple Process', description: 'No software install required.' },
      { icon: 'Clock3', title: 'Fast Reframing', description: 'Get presentation content ready quickly.' },
      { icon: 'Smartphone', title: 'Cross Platform', description: 'Use it from any browser.' },
    ],
    useCases: [
      { title: 'Pitch Decks', description: 'Convert reports into editable slide decks.', audience: 'Founders' },
      { title: 'Training', description: 'Turn manuals and notes into presentation formats.', audience: 'Teams' },
      { title: 'Academic Slides', description: 'Rebuild lecture material from PDFs into slides.', audience: 'Students' },
    ],
    relatedTools: ['powerpoint-to-pdf', 'pdf-to-word', 'pdf-to-images', 'compress-pdf'],
  },
  'powerpoint-to-pdf': {
    howToSteps: [
      { title: 'Upload Presentation', description: 'Choose the PPT or PPTX file you want to convert.', icon: 'Upload' },
      { title: 'Convert to PDF', description: 'Generate a fixed-layout PDF for easy sharing and printing.', icon: 'Wand2' },
      { title: 'Download Result', description: 'Save the presentation as a clean PDF copy.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Print-Ready', description: 'Share your deck as a readable PDF file.' },
      { icon: 'ShieldCheck', title: 'Stable Layout', description: 'Keep the slide design readable.' },
      { icon: 'Clock3', title: 'Quick Export', description: 'Move from deck to PDF quickly.' },
      { icon: 'Smartphone', title: 'Simple Access', description: 'Use on any browser or device.' },
    ],
    useCases: [
      { title: 'Client Reviews', description: 'Share polished deck versions without editing permissions.', audience: 'Agencies' },
      { title: 'Training Sessions', description: 'Distribute workshop slides as final PDF copies.', audience: 'Teams' },
      { title: 'Archives', description: 'Save presentation records in a stable, shareable format.', audience: 'Organizations' },
    ],
    relatedTools: ['pdf-to-powerpoint', 'word-to-pdf', 'compress-pdf', 'pdf-to-images'],
  },
  'pdf-to-images': {
    howToSteps: [
      { title: 'Upload PDF', description: 'Select the document or page range you want to export as images.', icon: 'Upload' },
      { title: 'Choose Image Output', description: 'Pick JPG, PNG, or WebP for each page export.', icon: 'Wand2' },
      { title: 'Download Images', description: 'Save each converted page as a ready-to-use image file.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Image Export', description: 'Turn pages into JPG, PNG, or WebP files.' },
      { icon: 'ShieldCheck', title: 'Visual Workflow', description: 'Perfect for content extraction and review.' },
      { icon: 'Clock3', title: 'Fast Conversion', description: 'Turn pages into images in seconds.' },
      { icon: 'Smartphone', title: 'Flexible', description: 'Useful for web, social, and design workflows.' },
    ],
    useCases: [
      { title: 'Social Sharing', description: 'Turn a page into a square or story-ready image.', audience: 'Creators' },
      { title: 'Design Mockups', description: 'Use pages as visual references in presentation work.', audience: 'Designers' },
      { title: 'Page Reviews', description: 'Capture specific PDF pages for sign-off or review.', audience: 'Teams' },
    ],
    relatedTools: ['images-to-pdf', 'pdf-to-text', 'compress-pdf', 'pdf-to-word'],
  },
  'images-to-pdf': {
    howToSteps: [
      { title: 'Upload Images', description: 'Drag in JPG, PNG, or WebP files for conversion.', icon: 'Upload' },
      { title: 'Arrange Pages', description: 'Reorder images so the final PDF flows in the correct order.', icon: 'Move' },
      { title: 'Create PDF', description: 'Download the final document with all images combined.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Image Collection', description: 'Turn several images into one PDF document.' },
      { icon: 'ShieldCheck', title: 'Simple Layout', description: 'Keep file organization clear and clean.' },
      { icon: 'Clock3', title: 'Fast Export', description: 'Build PDFs quickly for daily workflows.' },
      { icon: 'Smartphone', title: 'Cross-device', description: 'Works on any modern browser.' },
    ],
    useCases: [
      { title: 'Scan Archiving', description: 'Bundle photos of receipts or handwritten notes into one PDF.', audience: 'Freelancers' },
      { title: 'Portfolio Delivery', description: 'Package visual captures for client review.', audience: 'Designers' },
      { title: 'Forms', description: 'Combine images of forms or checklists into one document.', audience: 'Teams' },
    ],
    relatedTools: ['pdf-to-images', 'compress-images', 'word-to-pdf', 'merge-pdf'],
  },
  'pdf-to-text': {
    howToSteps: [
      { title: 'Upload PDF', description: 'Load the PDF you want to extract text from.', icon: 'Upload' },
      { title: 'Extract Text', description: 'Retrieve the text quickly with OCR support for clearer results.', icon: 'Wand2' },
      { title: 'Copy & Save', description: 'Copy the output, save it, or use it in another doc.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Text Extraction', description: 'Pull readable content from a PDF quickly.' },
      { icon: 'ShieldCheck', title: 'OCR Ready', description: 'Improve accuracy on scanned pages.' },
      { icon: 'Clock3', title: 'Fast Access', description: 'Get the content without retyping.' },
      { icon: 'Smartphone', title: 'Easy to Use', description: 'No software needed.' },
    ],
    useCases: [
      { title: 'Research', description: 'Copy text from PDFs into notes or article drafts.', audience: 'Students' },
      { title: 'Records', description: 'Extract content from forms and documents for easy updating.', audience: 'Operations Teams' },
      { title: 'Reference', description: 'Capture key sections from essays and reports for citation.', audience: 'Researchers' },
    ],
    relatedTools: ['ocr-pdf', 'pdf-to-word', 'compress-pdf', 'pdf-to-excel'],
  },
  'latex-to-text': {
    howToSteps: [
      { title: 'Paste LaTeX', description: 'Drop in a fraction, root, sum, or other formula and preview it immediately.', icon: 'Upload' },
      { title: 'Review the Output', description: 'Check the live KaTeX preview before copying anything.', icon: 'Wand2' },
      { title: 'Copy the Right Format', description: 'Use plain text for editing, MathML for Word, or PNG fallback for Google Docs.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Readable Output', description: 'Convert LaTeX to plain Unicode text suitable for everyday editing.' },
      { icon: 'ShieldCheck', title: 'Word-Ready Option', description: 'Keep a MathML-specific path when the document needs a native equation.' },
      { icon: 'Clock3', title: 'Instant Preview', description: 'See the equation render in real time while you type.' },
      { icon: 'Smartphone', title: 'Browser-Only', description: 'Everything runs client-side without server dependencies.' },
    ],
    useCases: [
      { title: 'Notes', description: 'Paste equations into docs, notes, or chat messages without raw LaTeX noise.', audience: 'Students' },
      { title: 'Reports', description: 'Use plain text for clear equations in reports and email drafts.', audience: 'Researchers' },
      { title: 'Collaboration', description: 'Move formulas into Notion, Slack, Docs, and Word without formatting issues.', audience: 'Teams' },
    ],
    relatedTools: ['pdf-to-text', 'ocr-pdf', 'pdf-to-word'],
  },
  'ocr-pdf': {
    howToSteps: [
      { title: 'Upload Scanned PDF', description: 'Choose a scanned document or image-heavy PDF to OCR.', icon: 'Upload' },
      { title: 'Recognize Text', description: 'Let the OCR process extract clear text from the file.', icon: 'Wand2' },
      { title: 'Download Result', description: 'Save the recognized text or converted document.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'OCR Detection', description: 'Read scanned pages and extract text more accurately.' },
      { icon: 'ShieldCheck', title: 'Privacy-Friendly', description: 'Works in a secure browser workflow.' },
      { icon: 'Clock3', title: 'Built for Speed', description: 'Get results without long delays.' },
      { icon: 'Smartphone', title: 'Accessible', description: 'Runs in the browser on any device.' },
    ],
    useCases: [
      { title: 'Archived Files', description: 'Turn older scanned PDFs into searchable, editable text.', audience: 'Archives' },
      { title: 'Invoices', description: 'Extract data from scanned receipts and statements.', audience: 'Bookkeepers' },
      { title: 'Forms', description: 'Convert paper forms into text that can be repurposed quickly.', audience: 'Teams' },
    ],
    relatedTools: ['pdf-to-text', 'pdf-to-word', 'compress-pdf', 'images-to-pdf'],
  },
  'rotate-pdf': {
    howToSteps: [
      { title: 'Upload PDF', description: 'Select the document with pages that need correction.', icon: 'Upload' },
      { title: 'Rotate Pages', description: 'Choose the right degree and page range for the final output.', icon: 'Wand2' },
      { title: 'Download Fixed PDF', description: 'Save the corrected document and keep working.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Page Control', description: 'Rotate selected pages or the full document.' },
      { icon: 'ShieldCheck', title: 'Safe Workflow', description: 'No complex software or setup required.' },
      { icon: 'Clock3', title: 'Quick Fix', description: 'Get pages oriented correctly in seconds.' },
      { icon: 'Smartphone', title: 'Responsive', description: 'Works on mobile and desktop screens.' },
    ],
    useCases: [
      { title: 'Scanned Documents', description: 'Fix sideways pages to make the PDF readable again.', audience: 'Students' },
      { title: 'Forms', description: 'Correct orientation for easier printing and sharing.', audience: 'Administrators' },
      { title: 'Reports', description: 'Align all pages before sending to clients or managers.', audience: 'Teams' },
    ],
    relatedTools: ['reorder-pages', 'split-pdf', 'compress-pdf', 'pdf-to-images'],
  },
  'reorder-pages': {
    howToSteps: [
      { title: 'Upload PDF', description: 'Choose the PDF with page order that needs adjusting.', icon: 'Upload' },
      { title: 'Drag to Reorder', description: 'Move pages into the correct sequence using a simple preview.', icon: 'Move' },
      { title: 'Save the New Order', description: 'Download the revised PDF with the final page order.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Simple Drag-and-Drop', description: 'Organize pages without complicated tooling.' },
      { icon: 'ShieldCheck', title: 'No Confusing Steps', description: 'Work in-browser with a clean preview.' },
      { icon: 'Clock3', title: 'Fast Editing', description: 'Fix the sequence in a few clicks.' },
      { icon: 'Smartphone', title: 'Mobile Friendly', description: 'Works from small screens and desktops.' },
    ],
    useCases: [
      { title: 'Reports', description: 'Rebuild the final order for client or stakeholder reviews.', audience: 'Professionals' },
      { title: 'Contracts', description: 'Place pages in the correct agreement sequence.', audience: 'Legal Teams' },
      { title: 'Study Packs', description: 'Rearrange notes and chapters before sharing.', audience: 'Students' },
    ],
    relatedTools: ['merge-pdf', 'split-pdf', 'rotate-pdf', 'compress-pdf'],
  },
  'add-watermark': {
    howToSteps: [
      { title: 'Upload PDF', description: 'Select the document you want to brand or secure.', icon: 'Upload' },
      { title: 'Add Your Watermark', description: 'Set text, image, opacity, and placement to match your needs.', icon: 'Wand2' },
      { title: 'Download Marked PDF', description: 'Save the watermarked file and share it confidently.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Custom Branding', description: 'Add text or logo marks that fit your style.' },
      { icon: 'ShieldCheck', title: 'Professional Look', description: 'Protect your content without heavy editing.' },
      { icon: 'Clock3', title: 'Fast Setup', description: 'Create a marked version in minutes.' },
      { icon: 'Smartphone', title: 'Flexible', description: 'Works across multiple devices.' },
    ],
    useCases: [
      { title: 'Branding', description: 'Place a company logo or confidential watermark on files.', audience: 'Businesses' },
      { title: 'Course Materials', description: 'Mark internal documents for consistent ownership.', audience: 'Educators' },
      { title: 'Drafts', description: 'Flag documents clearly as confidential or under review.', audience: 'Teams' },
    ],
    relatedTools: ['protect-pdf', 'flatten-pdf', 'sign-pdf', 'compress-pdf'],
  },
  'protect-pdf': {
    howToSteps: [
      { title: 'Upload PDF', description: 'Choose the document you want to secure with a password.', icon: 'Upload' },
      { title: 'Set Password', description: 'Create a strong password and protect the file.', icon: 'ShieldCheck' },
      { title: 'Download Secured PDF', description: 'Save the encrypted version and share it securely.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Password Security', description: 'Protect confidential files without complicated setup.' },
      { icon: 'ShieldCheck', title: 'Confidentiality', description: 'Keep important PDFs locked for the right audience.' },
      { icon: 'Clock3', title: 'Fast Security', description: 'Secure documents in a few quick actions.' },
      { icon: 'Smartphone', title: 'Simple', description: 'Easy to use on any device.' },
    ],
    useCases: [
      { title: 'Client Documents', description: 'Lock a report or quotation before sending it out.', audience: 'Agencies' },
      { title: 'Financial Files', description: 'Protect statements, invoices, and account documents.', audience: 'Finance Teams' },
      { title: 'Contracts', description: 'Keep agreements protected until the correct recipients open them.', audience: 'Legal Teams' },
    ],
    relatedTools: ['unlock-pdf', 'flatten-pdf', 'sign-pdf', 'add-watermark'],
  },
  'unlock-pdf': {
    howToSteps: [
      { title: 'Upload Protected PDF', description: 'Choose the file you own or legally have permission to unlock.', icon: 'Upload' },
      { title: 'Remove Password', description: 'Enter the password and remove the restriction on the file.', icon: 'ShieldCheck' },
      { title: 'Download Unlocked PDF', description: 'Save the unlocked version for editing or viewing.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Simple Unlock', description: 'Open a password-protected PDF in a few steps.' },
      { icon: 'ShieldCheck', title: 'Legal Use', description: 'For files you are authorized to access.' },
      { icon: 'Clock3', title: 'Fast Recovery', description: 'Get access without desktop software.' },
      { icon: 'Smartphone', title: 'Browser Workflow', description: 'Works on mobile and desktop.' },
    ],
    useCases: [
      { title: 'Accessible Files', description: 'Unlock self-owned files for reediting or repurposing.', audience: 'Business Owners' },
      { title: 'Team Workflows', description: 'Make protected documents readable after authorized access is confirmed.', audience: 'Operations Teams' },
      { title: 'Reporting', description: 'Open necessary documents quickly for review and processing.', audience: 'Managers' },
    ],
    relatedTools: ['protect-pdf', 'flatten-pdf', 'sign-pdf', 'compress-pdf'],
  },
  'sign-pdf': {
    howToSteps: [
      { title: 'Upload PDF', description: 'Choose the agreement or form you need to sign.', icon: 'Upload' },
      { title: 'Place Signature', description: 'Add your signature or initials to the correct location.', icon: 'Wand2' },
      { title: 'Download Signed PDF', description: 'Save the signed document and share it right away.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Fast Signing', description: 'Add a signature without printing and scanning.' },
      { icon: 'ShieldCheck', title: 'Professional Flow', description: 'Useful for forms, approvals, and contracts.' },
      { icon: 'Clock3', title: 'Fewer Steps', description: 'Complete signing faster than manual methods.' },
      { icon: 'Smartphone', title: 'Works Anywhere', description: 'Use from your phone or laptop.' },
    ],
    useCases: [
      { title: 'Contracts', description: 'Add signatures to agreements and onboarding documents.', audience: 'Teams' },
      { title: 'Approval Forms', description: 'Sign internal approvals or employee forms', audience: 'HR Teams' },
      { title: 'Client Delivery', description: 'Finalize documents for presentation or acceptance.', audience: 'Agencies' },
    ],
    relatedTools: ['protect-pdf', 'unlock-pdf', 'flatten-pdf', 'add-watermark'],
  },
  'flatten-pdf': {
    howToSteps: [
      { title: 'Upload PDF', description: 'Pick the file with fields, comments, or annotations to finalize.', icon: 'Upload' },
      { title: 'Flatten the File', description: 'Convert fields and comments into a static final version.', icon: 'Wand2' },
      { title: 'Download Final PDF', description: 'Save the locked final output for sharing and printing.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Finalize Forms', description: 'Lock and freeze fields before distribution.' },
      { icon: 'ShieldCheck', title: 'Prevents Edits', description: 'Good for final handoff and print-safe output.' },
      { icon: 'Clock3', title: 'Fast Finalization', description: 'Turn a working document into a final version quickly.' },
      { icon: 'Smartphone', title: 'Easy to Use', description: 'Works right from the browser.' },
    ],
    useCases: [
      { title: 'Form Submission', description: 'Flatten forms before sending to avoid later edits.', audience: 'Administrators' },
      { title: 'Legal Review', description: 'Lock signatures, notes, and annotations into a final document.', audience: 'Legal Teams' },
      { title: 'Internal Approvals', description: 'Keep approval versions final for distribution.', audience: 'Managers' },
    ],
    relatedTools: ['protect-pdf', 'sign-pdf', 'unlock-pdf', 'add-watermark'],
  },
  'pdf-to-pdfa': {
    howToSteps: [
      { title: 'Upload PDF', description: 'Choose the file you want to preserve for long-term archiving.', icon: 'Upload' },
      { title: 'Convert to PDF/A', description: 'Create a stable archival version suitable for long-term storage.', icon: 'Wand2' },
      { title: 'Download Archive Copy', description: 'Save the archival PDF and keep the original for later use.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Archival Ready', description: 'Create a stable PDF/A for long-term preservation.' },
      { icon: 'ShieldCheck', title: 'Compliance Friendly', description: 'Helpful for records and document retention.' },
      { icon: 'Clock3', title: 'Quick Conversion', description: 'Turn a PDF into archive-ready format quickly.' },
      { icon: 'Smartphone', title: 'Simple Browser Process', description: 'Use it anywhere.' },
    ],
    useCases: [
      { title: 'Records', description: 'Archive invoices, statements, and legal records in a stable format.', audience: 'Organizations' },
      { title: 'Compliance', description: 'Maintain documents in a standards-friendly archival format.', audience: 'Compliance Teams' },
      { title: 'Long-term Storage', description: 'Preserve important files for future retrieval and readability.', audience: 'Libraries' },
    ],
    relatedTools: ['compress-pdf', 'protect-pdf', 'merge-pdf', 'pdf-to-word'],
  },
  'compress-images': {
    howToSteps: [
      { title: 'Upload Images', description: 'Choose JPG, PNG, or WebP files to compress.', icon: 'Upload' },
      { title: 'Optimize Size', description: 'Reduce file size while keeping the image readable.', icon: 'Wand2' },
      { title: 'Download Compressed Files', description: 'Save the optimized versions and share them faster.', icon: 'Download' },
    ],
    features: [
      { icon: 'Zap', title: 'Smaller Files', description: 'Reduce image sizes for faster uploads and sharing.' },
      { icon: 'ShieldCheck', title: 'Quality Balance', description: 'Keep clarity without large file sizes.' },
      { icon: 'Clock3', title: 'Instant Results', description: 'Optimize images in seconds.' },
      { icon: 'Smartphone', title: 'Works Everywhere', description: 'Use it from any browser.' },
    ],
    useCases: [
      { title: 'Web Uploads', description: 'Make images lighter for faster website and app uploads.', audience: 'Creators' },
      { title: 'Email', description: 'Shrink large photos so they pass attachment limits.', audience: 'Professionals' },
      { title: 'Portfolio Files', description: 'Compress photos for cleaner sharing and faster review.', audience: 'Designers' },
    ],
    relatedTools: ['images-to-pdf', 'pdf-to-images', 'compress-pdf', 'protect-pdf'],
  },
};

export default toolContent;
