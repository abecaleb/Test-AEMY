/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns7) block: 4 columns, each column is a vertical list of links
  // Table header row
  const headerRow = ['Columns (columns7)'];

  // Get all immediate child divs (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // SVG chevron icon (red, inline)
  const chevronSVG = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '10');
    svg.setAttribute('height', '10');
    svg.setAttribute('viewBox', '0 0 10 10');
    svg.setAttribute('style', 'vertical-align:middle;margin-right:4px;');
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    poly.setAttribute('points', '2,2 6,5 2,8');
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', '#d00000');
    poly.setAttribute('stroke-width', '2');
    poly.setAttribute('stroke-linecap', 'round');
    poly.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(poly);
    return svg;
  };

  // Each column's content: we want the entire <ul> per column, but with chevrons before each link
  const contentRow = columns.map(col => {
    const ul = col.querySelector('ul');
    if (!ul) return '';
    // Clone the <ul> so we don't mutate the source
    const newUl = ul.cloneNode(false);
    ul.querySelectorAll('li').forEach(li => {
      const newLi = li.cloneNode(false);
      // Find the first link in the li
      const a = li.querySelector('a');
      if (a) {
        const frag = document.createDocumentFragment();
        frag.appendChild(chevronSVG());
        frag.appendChild(a.cloneNode(true));
        newLi.appendChild(frag);
      }
      newUl.appendChild(newLi);
    });
    return newUl;
  });

  // Build table data
  const cells = [
    headerRow,
    contentRow
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
