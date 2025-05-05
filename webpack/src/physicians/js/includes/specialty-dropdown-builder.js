class SpecialtyDropdown {
  constructor(menuSelector, dropdownSelector) {
    this.menu = document.querySelector(menuSelector);
    this.dropdown = document.getElementById(dropdownSelector);
    this.init();
  }

  init() {
    if (!this.menu || !this.dropdown) return;

    // Set default "All Specialties"
    this.dropdown.innerHTML = `
      <option class="button is-checked" value="all" data-filter="" selected>
        All Specialties
      </option>
    `;

    this.populateDropdown();
  }

  getSpecialtyFromHref(href) {
    if (!href) return null;

    try {
      const url = new URL(href, window.location.origin);
      return url.searchParams.get("specialty") || null;
    } catch (e) {
      return null;
    }
  }

  populateDropdown() {
    this.menu.querySelectorAll(':scope > li').forEach(parentItem => {
      const parentAnchor = parentItem.querySelector(':scope > a');
      const parentTextEl = parentAnchor?.querySelector('.x-anchor-text-primary');
      const parentLabel = parentTextEl?.textContent.trim() || null;
      const parentHref = parentAnchor?.getAttribute('href');
      const parentSlug = this.getSpecialtyFromHref(parentHref);

      const childMenu = parentItem.querySelector(':scope > .sub-menu');

      if (childMenu) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = parentLabel;

        childMenu.querySelectorAll(':scope > li').forEach(childItem => {
          const childAnchor = childItem.querySelector('a');
          const childTextEl = childAnchor?.querySelector('.x-anchor-text-primary');
          const childLabel = childTextEl?.textContent.trim();
          const childHref = childAnchor?.getAttribute('href');
          const childSlug = this.getSpecialtyFromHref(childHref);

          if (childLabel && childSlug) {
            const option = document.createElement('option');
            option.textContent = childLabel;
            option.value = childSlug;
            option.setAttribute('data-filter', `.${childSlug}`);
            optgroup.appendChild(option);
          }
        });

        this.dropdown.appendChild(optgroup);
      } else if (parentLabel && parentSlug) {
        const option = document.createElement('option');
        option.textContent = parentLabel;
        option.value = parentSlug;
        option.setAttribute('data-filter', `.${parentSlug}`);
        this.dropdown.appendChild(option);
      }
    });
  }
}

export default SpecialtyDropdown;
