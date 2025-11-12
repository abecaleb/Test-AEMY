/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Columns block
  const headerRow = ['Columns (columns8)'];

  // Find the logo (Westpac) and social icons container
  const logoDiv = element.querySelector('.footer-logo');
  const iconsDiv = element.querySelector('.footer-icons');

  // Get all social icon links (each with an <img>)
  let iconLinks = [];
  if (iconsDiv) {
    iconLinks = Array.from(iconsDiv.querySelectorAll('a'));
  }

  // Get the logo element (Westpac)
  let logoElem = null;
  if (logoDiv) {
    logoElem = logoDiv.querySelector('.icon-logo-footer');
  }

  // Build columns: one for each social icon (as <a> with aria-label and href), plus one for logo
  const columns = [];
  // Social icons first
  iconLinks.forEach(link => {
    // Clone the link to preserve attributes and image
    const a = link.cloneNode(true);
    columns.push(a);
  });
  // Logo column
  if (logoElem) {
    // Clone the span to preserve its text
    columns.push(logoElem.cloneNode(true));
  }

  // Table rows: header + one row with all columns
  const cells = [
    headerRow,
    columns
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
