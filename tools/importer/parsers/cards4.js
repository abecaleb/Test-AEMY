/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a cell with a field comment and content
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

  const rows = [];
  // Header row
  rows.push(['Cards (cards4)']);

  // --- Extract sidebar navigation as a card row ---
  const sidebar = element.querySelector('.col-lg-3');
  if (sidebar) {
    let imageContent = null;
    const frag = document.createDocumentFragment();
    const heading = sidebar.querySelector('.solution-heading');
    if (heading) {
      frag.appendChild(heading.cloneNode(true));
    }
    const list = sidebar.querySelector('.tiles-list');
    if (list) {
      frag.appendChild(list.cloneNode(true));
    }
    rows.push([
      imageContent,
      fieldCell('text', frag)
    ]);
  }

  // --- Extract main card grid ---
  const tilesCanvas = element.querySelector('.tiles-canvas');
  if (tilesCanvas) {
    const cardEls = tilesCanvas.querySelectorAll('.tiles-tile');
    cardEls.forEach((cardEl) => {
      let imageContent = null;
      let textContent = null;
      // Image/Icon cell
      const img = cardEl.querySelector('.tiles-tile-img');
      if (img) {
        const imgWrapper = img.closest('.tiles-tile-image-wrapper') || img;
        imageContent = fieldCell('image', imgWrapper.cloneNode(true));
      } else {
        const iconImg = cardEl.querySelector('.tile-icon img');
        if (iconImg) {
          imageContent = fieldCell('image', iconImg.cloneNode(true));
        }
      }
      // Text cell
      const tileText = cardEl.querySelector('.tiles-tile-text');
      if (tileText) {
        textContent = fieldCell('text', tileText.cloneNode(true));
      }
      rows.push([imageContent, textContent]);
    });
  }

  // --- Extract bottom CTA link as a card row ---
  const moreHelpLink = element.querySelector('.tiles-link');
  if (moreHelpLink) {
    let imageContent = null;
    let textContent = fieldCell('text', moreHelpLink.cloneNode(true));
    rows.push([imageContent, textContent]);
  }

  // Replace the original element with the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
