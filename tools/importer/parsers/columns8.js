/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns8)'];

  // Find the logo container (should be first column)
  const logoEl = element.querySelector('.footer-logo');
  // Find the icons container
  const iconsEl = element.querySelector('.footer-icons');

  // Gather all columns in correct visual order: logo first, then icons
  let columns = [];
  if (logoEl) {
    // If the logo container has an SVG or IMG, use that; otherwise, use its content
    const svgOrImg = logoEl.querySelector('svg, img');
    if (svgOrImg) {
      columns.push(svgOrImg.cloneNode(true));
    } else {
      // If just a span, clone it
      const span = logoEl.querySelector('span');
      if (span) {
        columns.push(span.cloneNode(true));
      } else {
        columns.push(logoEl.cloneNode(true));
      }
    }
  }
  if (iconsEl) {
    const iconLinks = Array.from(iconsEl.querySelectorAll('a'));
    columns = columns.concat(iconLinks.map(a => a.cloneNode(true)));
  }

  // Only create the row if we have columns
  const rows = columns.length > 0 ? [columns] : [];

  // Build the table: header row, then icons row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
