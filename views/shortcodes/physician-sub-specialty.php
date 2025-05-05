<?php
require_once plugin_dir_path(__FILE__) . '../../data/class-specialty-rebrand-physician-query.php';

$service = new Specialty_Rebrand_Physician_Query();
$specialty = isset($_GET['specialty']) && !empty($_GET['specialty']) ? $_GET['specialty'] : null;
$term = $specialty ? get_term_by('slug', $specialty, 'specialty_area') : null;

$physician_posts = $service->get_physicians_by_term_slug($specialty);
$term_children_objects = $term && $term->parent != 0
    ? $service->get_child_terms_with_physicians($term->term_id)
    : [];
?>

<div class="filters">
    <div class="expert-filter-container">
        <select class="button-group expert-filter" data-filter-group="specialty" id="specialty-dropdown">
            <option class="button is-checked" value="all" data-filter="" selected>All Specialties</option>
            <option class="button" value="footankle" data-filter=".footankle">Foot &amp; Ankle</option>
            <option class="button" value="generalorthopaedics" data-filter=".generalorthopaedics">General Orthopaedics</option>
            <option class="button" value="handwrist" data-filter=".handwrist">Hand &amp; Wrist</option>
            <option class="button" value="hipknee" data-filter=".hipknee">Hip &amp; Knee Replacement</option>
            <option class="button" value="oncology" data-filter=".oncology">Oncology</option>
            <option class="button" value="osteoporosis" data-filter=".osteoporosis">Osteoporosis</option>
            <option class="button" value="pediatric" data-filter=".pediatric">Pediatric</option>
            <option class="button" value="shoulder" data-filter=".shoulder">Shoulder &amp; Elbow</option>
            <option class="button" value="spineneckback" data-filter=".spineneckback">Spine (Neck &amp; Back)</option>
            <option class="button" value="sportsmedicine" data-filter=".sportsmedicine">Sports Medicine</option>
            <option class="button" value="trauma" data-filter=".trauma">Trauma</option>
        </select>
    </div>

    <div class="expert-filter-container">
        <select class="button-group expert-filter" data-filter-group="location" id="location-dropdown">
            <option class="button" data-filter=".">All Locations</option>
            <option class="button" data-filter=".harriman">Harriman</option>
            <option class="button" data-filter=".lakeway">Lakeway</option>
            <option class="button" data-filter=".maryville">Maryville</option>
            <option class="button" data-filter=".oak_ridge">Oak Ridge</option>
            <option class="button" data-filter=".powell">Powell</option>
            <option class="button" data-filter=".sevierville">Sevierville</option>
            <option class="button" data-filter=".turkey_creek">Turkey Creek</option>
            <option class="button" data-filter=".university">University</option>
            <option class="button" data-filter=".weisgarber">Weisgarber</option>
            <option class="button" data-filter=".west">West</option>
        </select>
    </div>

    <div class="expert-filter-container">
        <div class="button-group" data-filter-group="search">
            <input class="expert-filter-search-box" placeholder="Search By Name">
        </div>
    </div>
</div>

<!-- <div id="expert-loader" class="expert-loader" style="display: none;">
  <div class="spinner"></div>
</div> -->

<?php if (!empty($physician_posts)) : ?>
  <div class="expert-grid">
    <?php foreach ($physician_posts as $physician) : ?>
      <div class="expert-card">
        <a href="<?php echo esc_url($physician['permalink']); ?>">
          <img src="<?php echo esc_url($physician['featured_image']); ?>" alt="<?php echo esc_attr($physician['name']); ?>">
          <div class="expert-grid-title">
            <?php echo esc_html($physician['name']); ?><br>
            <?php echo esc_html($physician['job_title']); ?>
          </div>
        </a>
      </div>
    <?php endforeach; ?>
  </div>
<?php endif; ?>

<?php if (!empty($term_children_objects)) : ?>
  <?php foreach ($term_children_objects as $group) : 
      $group_name = $group['term']->name;
      $posts = $group['posts'];
  ?>
    <?php if (!empty($posts)) : ?>
      <h3 class="expert-section-heading"><?php echo esc_html($group_name); ?></h3>
      <div class="expert-grid">
        <?php foreach ($posts as $physician) : ?>
          <div class="expert-card">
            <a href="<?php echo esc_url($physician['permalink']); ?>">
              <img src="<?php echo esc_url($physician['featured_image']); ?>" alt="<?php echo esc_attr($physician['name']); ?>">
              <div class="expert-grid-title">
                <?php echo esc_html($physician['name']); ?><br>
                <?php echo esc_html($physician['job_title']); ?>
              </div>
            </a>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  <?php endforeach; ?>
<?php endif; ?>



<script>
document.addEventListener('DOMContentLoaded', function () {
  const menu = document.querySelector('#menu-item-1829 > .sub-menu');
  const dropdown = document.getElementById('specialty-dropdown');

  // Clear existing options except the "All Specialties"
  dropdown.innerHTML = '<option class="button is-checked" value="all" data-filter="" selected>All Specialties</option>';

  // Utility: slugify text for use as value/filter
  function slugify(text) {
    return text.toLowerCase().replace(/&/g, 'and').replace(/[^\w]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  // Iterate menu items
  menu.querySelectorAll(':scope > li').forEach(parentItem => {
    const parentAnchor = parentItem.querySelector(':scope > a .x-anchor-text-primary');
    const parentLabel = parentAnchor ? parentAnchor.textContent.trim() : null;

    const childMenu = parentItem.querySelector(':scope > .sub-menu');
    if (childMenu) {
      // Create an optgroup
      const optgroup = document.createElement('optgroup');
      optgroup.label = parentLabel;

      childMenu.querySelectorAll(':scope > li').forEach(childItem => {
        const childAnchor = childItem.querySelector('.x-anchor-text-primary');
        if (childAnchor) {
          const option = document.createElement('option');
          const text = childAnchor.textContent.trim();
          option.textContent = text;
          option.value = slugify(text); // Or extract from href param if needed
          option.setAttribute('data-filter', `.${option.value}`);
          optgroup.appendChild(option);
        }
      });

      dropdown.appendChild(optgroup);
    } else if (parentLabel) {
      // No children; just a regular option
      const option = document.createElement('option');
      option.textContent = parentLabel;
      option.value = slugify(parentLabel);
      option.setAttribute('data-filter', `.${option.value}`);
      dropdown.appendChild(option);
    }
  });
});
</script>
