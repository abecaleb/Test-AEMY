/* global WebImporter */
export default function parse(element, { document }) {
  // Table (bordered, tableBordered5) block: 4 columns, 1 header row, 1 data row
  const headerRow = ['Table (bordered, tableBordered5)'];

  // Get all sl-content blocks (each column)
  const columns = Array.from(element.querySelectorAll('.sl-content'));
  if (!columns.length) return;

  // Each cell: column header (h3) as strong + body content
  const dataRow = columns.map(col => {
    const frag = document.createDocumentFragment();
    const h = col.querySelector('.sl-title');
    if (h) {
      const strong = document.createElement('strong');
      strong.textContent = h.textContent.trim();
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }
    const body = col.querySelector('.sl-body');
    if (body) {
      Array.from(body.childNodes).forEach((node) => frag.appendChild(node.cloneNode(true)));
    }
    return frag;
  });

  // Table rows: header row, then 1 data row with 4 columns
  const tableRows = [headerRow, dataRow];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element
  element.replaceWith(block);
}
