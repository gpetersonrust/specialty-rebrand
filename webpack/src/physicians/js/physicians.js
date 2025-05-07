import '../scss/physicians.scss';
import ExpertFilterUI from './includes/expert-filter-ui';
import SpecialtyDropdown from './includes/specialty-dropdown-builder';
 
 
 
document.addEventListener('DOMContentLoaded', function () {
    const specialtyDropdown = new SpecialtyDropdown('#menu-item-7538 > .sub-menu', 'specialty-dropdown');
    const expertFilterUI = new ExpertFilterUI();
  });