/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to wrap content with field comment
  function withFieldComment(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // Table header row
  const headerRow = ['Cards (cards4)'];
  const rows = [headerRow];

  // --- SIDEBAR (as a card row) ---
  const sidebar = element.querySelector('.col-lg-3');
  if (sidebar) {
    const sidebarFrag = document.createDocumentFragment();
    const heading = sidebar.querySelector('.solution-heading');
    if (heading) sidebarFrag.appendChild(heading.cloneNode(true));
    const list = sidebar.querySelector('ul');
    if (list) sidebarFrag.appendChild(list.cloneNode(true));
    rows.push([
      '',
      withFieldComment('text', sidebarFrag)
    ]);
  }

  // --- CARDS ---
  const cardsContainer = element.querySelector('.tiles-canvas');
  if (cardsContainer) {
    const cardEls = Array.from(cardsContainer.querySelectorAll('.tiles-tile'));
    cardEls.forEach(cardEl => {
      // IMAGE/ICON CELL
      let imageCell = '';
      const img = cardEl.querySelector('img');
      if (img) {
        imageCell = withFieldComment('image', img.cloneNode(true));
      } else {
        // Try to get the icon span or svg
        const icon = cardEl.querySelector('span.icon, svg');
        if (icon) {
          imageCell = withFieldComment('image', icon.cloneNode(true));
        }
      }
      // TEXT CELL
      const textFrag = document.createDocumentFragment();
      // Get all text content (not just h3/p)
      // Clone the .tiles-tile-text or .tiles-tile-textonly container
      const textContainer = cardEl.querySelector('.tiles-tile-text, .tiles-tile-textonly');
      if (textContainer) {
        textFrag.appendChild(textContainer.cloneNode(true));
      } else {
        // fallback: append all h3 and p
        cardEl.querySelectorAll('h3, p').forEach(el => {
          textFrag.appendChild(el.cloneNode(true));
        });
      }
      rows.push([
        imageCell,
        withFieldComment('text', textFrag)
      ]);
    });
  }

  // --- CTA LINK (below cards, must include all text content) ---
  const ctaLink = element.querySelector('.tiles-canvas + a');
  if (ctaLink && ctaLink.textContent.trim()) {
    const frag = document.createDocumentFragment();
    frag.appendChild(ctaLink.cloneNode(true));
    rows.push([
      '',
      withFieldComment('text', frag)
    ]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
