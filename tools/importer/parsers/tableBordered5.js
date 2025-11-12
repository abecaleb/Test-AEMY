/* global WebImporter */
export default function parse(element, { document }) {
  // Get all the columns
  const columns = Array.from(element.querySelectorAll('.sl-content'));

  // Header row: block name only (single cell)
  const headerRow = ['Table (bordered, tableBordered5)'];

  // Data row: each column contains the full content (title + body)
  const dataRow = columns.map(col => {
    const frag = document.createDocumentFragment();
    const title = col.querySelector('.sl-title');
    if (title) frag.appendChild(title.cloneNode(true));
    const body = col.querySelector('.sl-body');
    if (body) frag.appendChild(body.cloneNode(true));
    return frag;
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    dataRow
  ], document);

  // Ensure the header row is a single cell spanning all columns
  const tr = table.querySelector('tr');
  if (tr && columns.length > 1) {
    const th = tr.querySelector('th');
    if (th) th.setAttribute('colspan', columns.length);
  }

  element.replaceWith(table);
}
