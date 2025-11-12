/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns6) block: No field comments required in cells
  // Get the two columns: left (image), right (text)
  // Defensive: find the .row, then its immediate children (columns)
  const row = element.querySelector('.row');
  if (!row) return;
  const columns = Array.from(row.children); // Should be two: .col-xs-12.col-sm-4, .col-xs-12.col-sm-8

  // Left column: image
  let leftContent = null;
  const leftCol = columns[0];
  if (leftCol) {
    // Find the image-wrapper or image
    const imgWrapper = leftCol.querySelector('.image-wrapper, img');
    leftContent = imgWrapper ? imgWrapper : leftCol;
  }

  // Right column: text
  let rightContent = null;
  const rightCol = columns[1];
  if (rightCol) {
    // Find the bodycopy or just use the column
    const bodycopy = rightCol.querySelector('.bodycopy') || rightCol;
    rightContent = bodycopy;
  }

  // Build the table structure
  const headerRow = ['Columns (columns6)'];
  const contentRow = [
    leftContent,
    rightContent,
  ];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
