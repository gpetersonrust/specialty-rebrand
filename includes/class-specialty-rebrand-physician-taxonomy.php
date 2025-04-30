<?php
/**
 * Define the physician specialty taxonomy and seed terms.
 *
 * @package    Specialty_Rebrand
 * @subpackage Specialty_Rebrand/includes
 */

class Specialty_Rebrand_Physician_Taxonomy {

    /**
     * Register actions using the plugin loader.
     *
     * @param Specialty_Rebrand_Loader $loader The loader to define hooks with.
     */
    public function define_hooks($loader) {
        $loader->add_action('init', $this, 'register_specialty_taxonomy');
        $loader->add_action('init', $this, 'maybe_seed_terms', 20); // Runs after taxonomy is registered
    }

    /**
     * Register the hierarchical taxonomy.
     */
    public function register_specialty_taxonomy() {
        register_taxonomy(
            'specialty_area',
            'physician',
            array(
                'hierarchical' => true,
                'labels' => array(
                    'name' => 'Specialty Areas',
                    'singular_name' => 'Specialty Area',
                    'search_items' => 'Search Specialty Areas',
                    'all_items' => 'All Specialty Areas',
                    'parent_item' => 'Parent Specialty Area',
                    'edit_item' => 'Edit Specialty Area',
                    'update_item' => 'Update Specialty Area',
                    'add_new_item' => 'Add New Specialty Area',
                    'new_item_name' => 'New Specialty Area Name',
                    'menu_name' => 'Specialty Areas',
                ),
                'show_ui' => true,
                'show_admin_column' => true,
                'rewrite' => array('slug' => 'specialty'),
                'show_in_rest' => true,
            )
        );
    }

    /**
     * Seed terms only once (or based on an option flag).
     */
    public function maybe_seed_terms() {
        if (get_option('specialty_rebrand_terms_seeded')) {
            return;
        }

        $this->seed_terms();
        update_option('specialty_rebrand_terms_seeded', true);
    }

    /**
     * Seed specialty terms and log.
     */
    private function seed_terms() {
        $taxonomy = 'specialty_area';
        $added_terms = [];
        $skipped_terms = [];

        $terms = [
            'Elbow' => [
                'Elbow (Sports)' => ['Non-Surgical (Elbow)']
            ],
            'Foot & Ankle' => [
                'Orthopaedic Surgery',
                'Podiatry',
                'Sports (Foot & Ankle)' => ['Non-Surgical (Foot & Ankle)']
            ],
            'General Orthopaedics' => [],
            'Hand & Wrist' => [
                'Hand & Wrist (Sports)' => ['Non-Surgical (Hand & Wrist)']
            ],
            'Hip' => [
                'General (Hip)',
                'Hip Replacement' => ['Also Performs Hip Replacement'],
                'Hip (Sports)' => ['Non-Surgical (Hip)']
            ],
            'Joint Replacement' => [
                'Ankle Replacement',
                'Hip Replacement' => ['Also Performs Hip Replacement'],
                'Knee Replacement' => ['Also Performs Knee Replacement'],
                'Shoulder Replacement' => ['Also Performs Shoulder Replacement']
            ],
            'Knee' => [
                'General (Knee)',
                'Knee Replacement' => ['Also Performs Knee Replacement'],
                'Knee (Sports)' => ['Non-Surgical (Knee)']
            ],
            'Oncology' => [],
            'Osteoporosis' => [],
            'Pediatric' => [],
            'Shoulder' => [
                'General (Shoulder)',
                'Shoulder Replacement' => ['Also Performs Shoulder Replacement'],
                'Shoulder (Sports)' => ['Non-Surgical (Shoulder)']
            ],
            'Spine (Neck & Back)' => [
                'Surgical (Spine)',
                'Non-Surgical (Spine)'
            ],
            'Sports Medicine' => [
                'Surgical (Sports)',
                'Non-Surgical (Sports)'
            ],
            'Trauma' => [],
        ];

        foreach ($terms as $parent => $children) {
            $parent_term = wp_insert_term($parent, $taxonomy);
            $parent_id = is_wp_error($parent_term)
                ? (get_term_by('name', $parent, $taxonomy)->term_id ?? 0)
                : $parent_term['term_id'];

            is_wp_error($parent_term) ? $skipped_terms[] = $parent : $added_terms[] = $parent;

            foreach ($children as $child => $grandchildren) {
                if (is_array($grandchildren)) {
                    $child_term = wp_insert_term($child, $taxonomy, ['parent' => $parent_id]);
                    $child_id = is_wp_error($child_term)
                        ? (get_term_by('name', $child, $taxonomy)->term_id ?? 0)
                        : $child_term['term_id'];

                    is_wp_error($child_term) ? $skipped_terms[] = $child : $added_terms[] = $child;

                    foreach ($grandchildren as $grandchild) {
                        $grand_term = wp_insert_term($grandchild, $taxonomy, ['parent' => $child_id]);
                        is_wp_error($grand_term) ? $skipped_terms[] = $grandchild : $added_terms[] = $grandchild;
                    }
                } else {
                    $single_term = wp_insert_term($child, $taxonomy, ['parent' => $parent_id]);
                    is_wp_error($single_term) ? $skipped_terms[] = $child : $added_terms[] = $child;
                }
            }
        }

        $log_file = plugin_dir_path(dirname(__FILE__)) . 'specialty-area-taxonomy.log';
        $log_output = "=== Specialty Area Term Creation Log ===\n";
        $log_output .= "Date: " . date('Y-m-d H:i:s') . "\n\n";
        $log_output .= "Added Terms:\n" . implode("\n  + ", $added_terms);
        $log_output .= "\n\nSkipped Terms (already existed):\n" . implode("\n  - ", $skipped_terms);
        $log_output .= "\n-----------------------------\n";
        file_put_contents($log_file, $log_output, FILE_APPEND);
    }
}
?>