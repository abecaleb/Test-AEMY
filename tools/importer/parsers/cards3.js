/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to add field comment before content
  function fieldCell(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    if (Array.isArray(content)) {
      content.forEach((el) => frag.appendChild(el));
    } else {
      frag.appendChild(content);
    }
    return frag;
  }

  // Header row
  const headerRow = ['Cards (cards3)'];

  const cards = [];

  // --- Only add actual cards from the main grid ---
  const tilesCanvas = element.querySelector('.tiles-canvas');
  if (tilesCanvas) {
    const tileEls = tilesCanvas.querySelectorAll('.tiles-tile');
    tileEls.forEach((tile, idx) => {
      // Image/Icon cell
      let imageEl = null;
      const img = tile.querySelector('img');
      if (img) {
        const imgWrap = img.closest('.tiles-tile-image-wrapper');
        imageEl = imgWrap ? imgWrap.cloneNode(true) : img.cloneNode(true);
      } else {
        const iconSpan = tile.querySelector('.tile-icon');
        if (iconSpan) imageEl = iconSpan.cloneNode(true);
      }
      // Text cell: gather all text content (heading, description, etc)
      let textCellContent = [];
      const heading = tile.querySelector('.tile-heading');
      if (heading) textCellContent.push(heading.cloneNode(true));
      const desc = tile.querySelector('p');
      if (desc) textCellContent.push(desc.cloneNode(true));
      // Also include any links inside the tile's text area
      const textWrap = tile.querySelector('.tiles-tile-text');
      if (textWrap) {
        textWrap.querySelectorAll('a').forEach((a) => {
          if (!textCellContent.some((el) => el.isSameNode(a))) {
            textCellContent.push(a.cloneNode(true));
          }
        });
      }
      if (textCellContent.length === 0 && textWrap) {
        textCellContent.push(textWrap.cloneNode(true));
      }
      if (textCellContent.length === 0) {
        textCellContent.push(document.createTextNode(tile.textContent.trim()));
      }
      // If this is the last card and there is a More articles link, append it as CTA
      let row;
      if (idx === tileEls.length - 1) {
        const moreLink = tilesCanvas.querySelector('.tiles-link');
        if (moreLink) {
          // Try to get the anchor if available
          const moreAnchor = moreLink.closest('a') ? moreLink.closest('a').cloneNode(true) : moreLink.cloneNode(true);
          textCellContent.push(moreAnchor);
        }
      }
      row = [
        imageEl ? fieldCell('image', imageEl) : document.createDocumentFragment(),
        fieldCell('text', textCellContent)
      ];
      cards.push(row);
    });
  }

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cards
  ], document);

  // Replace element
  element.replaceWith(table);
}
