/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns6)'];

  // Defensive: Get immediate children for layout
  // The structure is: .column-container > .container-fluid > .row > .col-xs-12.col-sm-4 (image), .col-xs-12.col-sm-8 (text)
  const row = element.querySelector('.row');
  if (!row) return;
  const cols = Array.from(row.children);

  // Column 1: image
  let col1Content = null;
  const imgCol = cols.find(col => col.classList.contains('col-sm-4'));
  if (imgCol) {
    // Find the image element
    const imgWrapper = imgCol.querySelector('.image-wrapper');
    if (imgWrapper) {
      const img = imgWrapper.querySelector('img');
      if (img) {
        col1Content = img;
      }
    }
  }

  // Column 2: text
  let col2Content = null;
  const textCol = cols.find(col => col.classList.contains('col-sm-8'));
  if (textCol) {
    const bodycopy = textCol.querySelector('.bodycopy');
    if (bodycopy) {
      // Use the whole bodycopy block for resilience
      col2Content = bodycopy;
    }
  }

  // Build the table cells
  // First row: header
  // Second row: two columns (image, text)
  const cells = [
    headerRow,
    [col1Content, col2Content]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
