/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block: no field comments required in cells
  // Get the immediate row children (the columns)
  const row = element.querySelector('.row');
  if (!row) return;

  // Get the two columns (image and text)
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // Left column: find image (may be wrapped)
  let leftContent = null;
  const leftImgWrap = cols[0].querySelector('.image-wrapper, .image-component, img');
  if (leftImgWrap) {
    // If it's an image wrapper, get the image inside
    const img = leftImgWrap.querySelector('img') || leftImgWrap;
    leftContent = img;
  }

  // Right column: find bodycopy/text
  let rightContent = null;
  const bodyCopy = cols[1].querySelector('.bodycopy') || cols[1];
  if (bodyCopy) {
    rightContent = bodyCopy;
  }

  // Table header row
  const headerRow = ['Columns (columns6)'];
  // Content row: image left, text right
  const contentRow = [leftContent, rightContent];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
