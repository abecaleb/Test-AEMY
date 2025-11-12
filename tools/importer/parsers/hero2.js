/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to add field comment before content
  function fieldCell(field, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${field} `));
    frag.appendChild(content);
    return frag;
  }

  // Header row
  const headerRow = ['Hero (hero2)'];

  // --- Extract image (model field: image) ---
  // Find the first <img> inside the hero block
  const img = element.querySelector('img');
  let imageCell = '';
  if (img) {
    // Ensure alt attribute is present (model field: imageAlt)
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
    }
    // Wrap in <picture> for best practice
    const picture = document.createElement('picture');
    picture.appendChild(img);
    imageCell = fieldCell('image', picture);
  }

  // --- Extract text (model field: text) ---
  // Find headline, subheading, and CTA
  // Headline: strong.slide-text-classic
  // Subheading: p.slide-text-body-fineprint
  // CTA: .slide-text-footer-button (a)
  const textWrapper = element.querySelector('.slide-text-wrapper');
  let textCell = '';
  if (textWrapper) {
    // Compose richtext fragment
    const frag = document.createDocumentFragment();
    // Headline
    const headline = textWrapper.querySelector('.slide-text-header strong');
    if (headline) {
      const h1 = document.createElement('h1');
      h1.textContent = headline.textContent;
      frag.appendChild(h1);
    }
    // Subheading
    const subheading = textWrapper.querySelector('.slide-text-body-fineprint');
    if (subheading) {
      frag.appendChild(subheading);
    }
    // CTA
    const cta = element.querySelector('.slide-text-footer-button');
    if (cta) {
      frag.appendChild(cta);
    }
    textCell = fieldCell('text', frag);
  }

  // Build table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell]
  ];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
