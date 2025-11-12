/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a fragment with a field comment and content
  function fieldFragment(fieldName, content) {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    frag.appendChild(content);
    return frag;
  }

  // --- HEADER ROW ---
  const headerRow = ['Hero (hero2)'];

  // --- IMAGE ROW ---
  // Find the first <img> in the carousel slide
  let imageCell = '';
  const img = element.querySelector('img');
  if (img) {
    // Wrap image in <picture> for best practice
    const picture = document.createElement('picture');
    picture.appendChild(img);
    imageCell = fieldFragment('image', picture);
  }

  // --- TEXT ROW ---
  // Find the main heading, subheading, and CTA button
  let textCell = '';
  const slideText = element.querySelector('.slide-text');
  if (slideText) {
    // Find headline (strong inside .slide-text-header)
    const header = slideText.querySelector('.slide-text-header strong');
    let headingEl = null;
    if (header) {
      headingEl = document.createElement('h1');
      headingEl.textContent = header.textContent.trim();
    }
    // Find subheading/fine print (p inside .slide-text-body)
    const finePrint = slideText.querySelector('.slide-text-body-fineprint');
    let finePrintEl = null;
    if (finePrint) {
      finePrintEl = document.createElement('p');
      finePrintEl.textContent = finePrint.textContent.trim();
    }
    // Find CTA button (a inside .slide-text-footer)
    const cta = slideText.querySelector('.slide-text-footer a');
    let ctaEl = null;
    if (cta) {
      // Use the anchor as-is
      ctaEl = cta;
    }
    // Compose all text elements into a fragment
    const textFrag = document.createDocumentFragment();
    if (headingEl) textFrag.appendChild(headingEl);
    if (finePrintEl) textFrag.appendChild(finePrintEl);
    if (ctaEl) textFrag.appendChild(ctaEl);
    textCell = fieldFragment('text', textFrag);
  }

  // --- TABLE CREATION ---
  const cells = [
    headerRow,
    [imageCell],
    [textCell],
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
