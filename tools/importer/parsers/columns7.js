/* global WebImporter */
export default function parse(element, { document }) {
  // Extract only the UL from each column
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Model fields: use all fields from the model, repeat as needed for all columns
  const modelFields = ['classes', 'columns', 'rows', 'rows'];

  const headerRow = ['Columns (columns7)'];

  // Build the columns row, each cell gets a field comment for a model field
  const columnsRow = columns.map((col, idx) => {
    const ul = col.querySelector('ul');
    let field = modelFields[idx];
    if (ul) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(` field:${field} `));
      frag.appendChild(ul.cloneNode(true));
      return frag;
    }
    return '';
  });

  const cells = [
    headerRow,
    columnsRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
