/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns8)'];

  // Get the icons and logo as columns
  // The icons are inside .footer-icons, the logo in .footer-logo
  const rowDiv = element.querySelector(':scope > .col-xs-12') || element;
  const logoDiv = rowDiv.querySelector('.footer-logo');
  const iconsDiv = rowDiv.querySelector('.footer-icons');

  // Defensive: get all icon links (each with an image)
  const iconLinks = iconsDiv ? Array.from(iconsDiv.querySelectorAll('a')) : [];
  // Defensive: get the logo span (could be an image or styled span)
  let logoContent = null;
  if (logoDiv) {
    // If logoDiv contains an image, use it; else use the whole logoDiv
    const logoImg = logoDiv.querySelector('img');
    if (logoImg) {
      logoContent = logoImg;
    } else {
      logoContent = logoDiv;
    }
  }

  // Compose the columns: Facebook, Twitter/X, YouTube, LinkedIn, Instagram, Westpac logo
  // There may be 5 icons + 1 logo (total 6 columns)
  // Defensive: ensure we have 6 columns, fill missing with empty
  const columns = [];
  for (let i = 0; i < 5; i++) {
    if (iconLinks[i]) {
      columns.push(iconLinks[i]);
    } else {
      columns.push('');
    }
  }
  columns.push(logoContent || '');

  // Table structure: header row, then one row with 6 columns
  const cells = [
    headerRow,
    columns
  ];

  // Add required HTML comments for model fields (including 'classes')
  // Model fields: classes, columns, rows
  // Only add comments for cells with content
  // Place comment BEFORE content in each cell
  const modelFields = ['classes', 'columns', 'rows'];
  const commentedCells = columns.map((content, idx) => {
    if (!content) return '';
    // Assign model fields to first three cells only, rest are empty (since only three fields)
    if (idx < modelFields.length) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(` field:${modelFields[idx]} `));
      frag.appendChild(content);
      return frag;
    }
    return content;
  });

  const cellsWithComments = [headerRow, commentedCells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cellsWithComments, document);
  // Replace the original element
  element.replaceWith(block);
}
