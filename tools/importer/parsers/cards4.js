/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to add field comment before content
  function fieldCell(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    if (content) frag.appendChild(content);
    return frag;
  }

  const cards = [];

  // Extract left navigation menu as a card
  const navCol = element.querySelector('.col-lg-3');
  if (navCol) {
    const heading = navCol.querySelector('.solution-heading');
    const list = navCol.querySelector('.tiles-list');
    const navFrag = document.createDocumentFragment();
    if (heading) navFrag.appendChild(heading.cloneNode(true));
    if (list) navFrag.appendChild(list.cloneNode(true));
    cards.push([
      fieldCell('image', null),
      fieldCell('text', navFrag)
    ]);
  }

  // The main card grid is inside .tiles-canvas2
  const grid = element.querySelector('.tiles-canvas2');
  if (grid) {
    // All card anchors (each card is a clickable <a>)
    const cardAnchors = grid.querySelectorAll('.tiles-anchor');
    cardAnchors.forEach((anchor) => {
      // Find image (if present)
      const img = anchor.querySelector('img');
      cards.push([
        fieldCell('image', img),
        fieldCell('text', anchor.cloneNode(true))
      ]);
    });
    // Add the call-to-action link as a card (last row)
    const ctaLink = grid.querySelector('a[href]:not(.tiles-anchor) .tiles-link');
    if (ctaLink) {
      const ctaAnchor = ctaLink.closest('a');
      cards.push([
        fieldCell('image', null),
        fieldCell('text', ctaAnchor ? ctaAnchor.cloneNode(true) : ctaLink.cloneNode(true))
      ]);
    }
  }

  // Table header
  const headerRow = ['Cards (cards4)'];
  // Compose table rows
  const rows = [headerRow, ...cards];
  // Create table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace element
  element.replaceWith(table);
}
