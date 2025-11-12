/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a field-commented fragment
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // 1. Table header row
  const headerRow = ['Hero (hero2)'];

  // 2. Image row (image field)
  // Find the first <img> in the block
  const img = element.querySelector('img');
  let imageCell = '';
  if (img) {
    // Wrap in <picture> for robustness
    const picture = document.createElement('picture');
    picture.appendChild(img);
    imageCell = fieldFragment('image', picture);
  }

  // 3. Text row (text field)
  // Find the main heading, subheading, and CTA
  let textCell = '';
  const slideText = element.querySelector('.slide-text');
  if (slideText) {
    // We'll collect heading, fine print, and CTA
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(' field:text '));
    // Heading
    const heading = slideText.querySelector('.slide-text-header strong');
    if (heading) frag.appendChild(heading);
    // Fine print/subheading
    const finePrint = slideText.querySelector('.slide-text-body-fineprint');
    if (finePrint) frag.appendChild(finePrint);
    // CTA button
    const cta = slideText.querySelector('.slide-text-footer-button');
    if (cta) frag.appendChild(cta);
    textCell = frag;
  }

  // Compose table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell]
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
