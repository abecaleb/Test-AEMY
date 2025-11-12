/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a cell with a field comment and content
  function fieldCell(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    if (content) frag.appendChild(content);
    return frag;
  }

  const cards = [];

  // Extract section heading (Personal) above the card grid
  const personalHeading = element.querySelector('.solution-heading');
  if (personalHeading && personalHeading.textContent.trim().toLowerCase() === 'personal') {
    cards.push([
      document.createDocumentFragment(),
      fieldCell('text', document.createTextNode(personalHeading.textContent))
    ]);
  }

  // Extract navigation links from the left sidebar
  const navList = element.querySelector('.tiles-list');
  if (navList) {
    navList.querySelectorAll('li a').forEach((link) => {
      cards.push([
        document.createDocumentFragment(),
        fieldCell('text', link.cloneNode(true))
      ]);
    });
  }

  // Cards are inside .tiles-canvas .tiles-tile
  const canvas = element.querySelector('.tiles-canvas');
  if (canvas) {
    canvas.querySelectorAll('.tiles-tile').forEach((tile) => {
      // First column: image or icon
      let imageCell = null;
      const img = tile.querySelector('img');
      if (img) {
        const picture = document.createElement('picture');
        picture.appendChild(img.cloneNode(true));
        imageCell = fieldCell('image', picture);
      } else {
        const icon = tile.querySelector('.tile-icon img');
        if (icon) {
          const picture = document.createElement('picture');
          picture.appendChild(icon.cloneNode(true));
          imageCell = fieldCell('image', picture);
        }
      }
      // Second column: text content
      let textCell = null;
      const textWrap = tile.querySelector('.tiles-tile-text');
      if (textWrap) {
        textCell = fieldCell('text', textWrap.cloneNode(true));
      }
      if (imageCell || textCell) {
        cards.push([
          imageCell || document.createDocumentFragment(),
          textCell || document.createDocumentFragment(),
        ]);
      }
    });
    // Find the 'More articles' link (call-to-action) and add as a card
    const moreLink = canvas.querySelector('.tiles-link');
    if (moreLink) {
      let moreLinkEl = moreLink.closest('a') || moreLink;
      cards.push([
        document.createDocumentFragment(),
        fieldCell('text', moreLinkEl.cloneNode(true))
      ]);
    }
  }

  // Extract the 'Business' section heading if present below the block
  const businessHeading = element.parentElement.querySelector('h2.solution-heading');
  if (businessHeading && businessHeading.textContent.trim().toLowerCase() === 'business') {
    cards.push([
      document.createDocumentFragment(),
      fieldCell('text', document.createTextNode(businessHeading.textContent))
    ]);
  }

  // Table header row
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow, ...cards];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
