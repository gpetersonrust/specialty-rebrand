class ExpertFilterUI {
  constructor() {
    this.filters = {
      specialty: '',
      location: '',
      title: ''
    };

    this.dropdownSpecialty = document.querySelector('#specialty-dropdown');
    this.dropdownLocation = document.querySelector('#location-dropdown');
    this.searchInput = document.querySelector('.expert-filter-search-box');
    this.container = document.querySelector('#expert-grid-container');
    this.loader = document.querySelector('#expert-loader');

    if (!this.dropdownSpecialty || !this.dropdownLocation || !this.searchInput || !this.container || !this.loader) {
      console.warn('ExpertFilterUI: Required elements not found.');
      return;
    }

    this.init();
  }

  init() {
    this.parseURLParams();
    this.syncUI();
    this.bindEvents();
    this.fetchAndRenderExperts();
  }

  parseURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    this.filters.specialty = urlParams.get('specialty') || 'all';
    if (!this.filters.location) {
      this.dropdownLocation.selectedIndex = 0; // selects first <option>
      this.filters.location = this.dropdownLocation.value;
    } else {
      this.dropdownLocation.value = this.filters.location;
    }
  
  
    this.filters.title = (urlParams.get('title') || '').toLowerCase();
  }

  syncUI() {
    
    this.dropdownSpecialty.value = this.filters.specialty;
    this.dropdownLocation.value = this.filters.location;
    this.searchInput.value = this.filters.title;
  }

  bindEvents() {
    this.dropdownSpecialty.addEventListener('change', (e) => {
      this.filters.specialty = e.target.value;
      this.updateURLParams();
      this.fetchAndRenderExperts();
    });

    this.dropdownLocation.addEventListener('change', (e) => {
      this.filters.location = e.target.value;
      this.updateURLParams();
      this.fetchAndRenderExperts();
    });

    this.searchInput.addEventListener('input', this.debounce((e) => {
      this.filters.title = e.target.value.toLowerCase();
      this.updateURLParams();
      this.fetchAndRenderExperts();
    }, 300));
  }

  updateURLParams() {
    const params = new URLSearchParams();
    if (this.filters.specialty && this.filters.specialty !== 'all') {
      params.set('specialty', this.filters.specialty);
    }
    if (this.filters.location) {
      params.set('location', this.filters.location);
    }
    if (this.filters.title) {
      params.set('title', this.filters.title);
    }
    const newURL = `${window.location.pathname}?${params.toString()}`;
    history.replaceState(null, '', newURL);
  }

  async fetchAndRenderExperts() {
    this.container.innerHTML = '';
    this.loader.style.display = 'block';
  
    try {
      const query = new URLSearchParams();
      if (this.filters.specialty && this.filters.specialty !== 'all') {
        query.set('specialty', this.filters.specialty);
      }
      if (this.filters.location) {
        if (this.filters.location.toLowerCase() !== 'all locations') {
          query.set('location', this.filters.location);
        } else {
          query.delete('location');
        }
      }
      if (this.filters.title) {
        query.set('name', this.filters.title);
      }
  
      const url = `/wp-json/specialty-rebrand/v1/physicians?${query.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
  
      const { physicians = [], term_children = [] } = data;
      const specialty = this.filters.specialty;
  
      if (physicians.length) {
        // Inject "Surgeons" heading for specific specialties
        if (['spine-neck-back', 'sports-medicine'].includes(specialty)) {
          const heading = document.createElement('h3');
          heading.className = 'expert-section-heading';
          heading.textContent = 'Surgeons';
          this.container.appendChild(heading);
        }
  
        const grid = this.createExpertGrid(physicians);
        this.container.appendChild(grid);
      }
  
      term_children.forEach(group => {
        if (group.posts.length) {
          const heading = document.createElement('h3');
          heading.className = 'expert-section-heading';
          heading.textContent = group.term.name.replace(/&amp;/g, '&');
          this.container.appendChild(heading);
  
          const grid = this.createExpertGrid(group.posts);
          this.container.appendChild(grid);
        }
      });
  
    } catch (err) {
      this.container.innerHTML = `<p>Error loading physician data. Please try again.</p>`;
      console.error('Fetch failed:', err);
    }
  
    this.loader.style.display = 'none';
  }
  
  createExpertGrid(physicians) {
    const grid = document.createElement('div');
    grid.className = 'expert-grid';

    physicians.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'expert-card';

      card.dataset.location = this.slugify(doc.locations);
      card.dataset.specialties = doc.specialties.map(this.slugify).join(' ');

      card.innerHTML = `
        <a href="${doc.permalink}">
          <img src="${doc.featured_image}" alt="${doc.name}">
          <div class="expert-grid-title">
            ${doc.name}<br>${doc.job_title}
          </div>
        </a>
      `;

      grid.appendChild(card);
    });

    return grid;
  }

  slugify(str) {
    return (str || '')
      .toLowerCase()
      .replace(/\s+/g, '-')         // Replace spaces with dashes
      .replace(/[^\w\-]+/g, '')     // Remove all non-word characters
      .replace(/\-\-+/g, '-')       // Replace multiple dashes with single
      .replace(/^-+|-+$/g, '');     // Trim leading/trailing dashes
  }

  debounce(fn, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }
}

export default ExpertFilterUI;
