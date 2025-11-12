/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards3) block: 2 columns, multiple rows
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  // Find the card container
  const cardsContainer = element.querySelector('.tiles-canvas');
  if (!cardsContainer) return;

  // --- CARDS ---
  const cardTiles = Array.from(cardsContainer.querySelectorAll('.tiles-tile'));
  cardTiles.forEach((tile) => {
    // Image or icon (mandatory)
    let imageOrIcon = null;
    const img = tile.querySelector('img');
    if (img) {
      imageOrIcon = img.cloneNode(true);
    } else {
      const iconSpan = tile.querySelector('.tile-icon');
      if (iconSpan) {
        const iconFrag = document.createDocumentFragment();
        Array.from(iconSpan.childNodes).forEach((node) => {
          iconFrag.appendChild(node.cloneNode(true));
        });
        imageOrIcon = iconFrag;
      }
    }
    if (!imageOrIcon) {
      imageOrIcon = document.createTextNode('');
    }

    // Text content (mandatory)
    let textContent = document.createDocumentFragment();
    const heading = tile.querySelector('.tile-heading');
    if (heading) {
      textContent.appendChild(heading.cloneNode(true));
    }
    const paragraphs = tile.querySelectorAll('p');
    paragraphs.forEach((p) => {
      textContent.appendChild(p.cloneNode(true));
    });

    // Compose cells with field comments
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(imageOrIcon);
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    textCell.appendChild(textContent);
    rows.push([imageCell, textCell]);
  });

  // --- MORE ARTICLES LINK as CTA OUTSIDE THE TABLE ---
  const moreArticles = cardsContainer.querySelector('.tiles-link');

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);

  // If there's a CTA, insert it after the block (not inside any card)
  if (moreArticles && moreArticles.textContent.trim()) {
    block.after(moreArticles.cloneNode(true));
  }
}
