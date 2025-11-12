/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row (block name)
  const headerRow = ['Table (bordered, tableBordered5)'];

  // Get all the main tile elements (each .sl-content is a column)
  const tiles = Array.from(element.querySelectorAll('.sl-content'));
  if (!tiles.length) return;

  // Extract header labels and content for each tile
  const columnHeaders = tiles.map(tile => {
    const header = tile.querySelector('.sl-header .sl-title');
    return header ? header.textContent.trim() : '';
  });

  // Extract content for each tile
  const columnContents = tiles.map(tile => {
    const body = tile.querySelector('.sl-body');
    return body ? body : tile;
  });

  // Compose the table cells array:
  // First row: block name (single cell)
  // Second row: each column contains the header and content stacked vertically
  const dataRow = columnHeaders.map((header, i) => {
    const frag = document.createDocumentFragment();
    // Header (bold)
    const headerEl = document.createElement('div');
    headerEl.textContent = header;
    headerEl.style.fontWeight = 'bold';
    frag.appendChild(headerEl);
    // Content
    frag.appendChild(columnContents[i]);
    return frag;
  });

  const cells = [
    headerRow,
    dataRow
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
