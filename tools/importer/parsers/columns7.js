/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns7) block: multi-column layout, only inner content in each cell
  // Get all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Build the header row
  const headerRow = ['Columns (columns7)'];

  // Compose the content row: one cell per column, only the <ul> list from each column
  const contentRow = columns.map((col) => {
    const ul = col.querySelector('ul');
    return ul ? ul : '';
  });

  // Build the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
