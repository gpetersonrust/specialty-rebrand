<?php
class Specialty_Rebrand_Admin_Pages {

    /**
     * Hook into WordPress using the plugin's loader class.
     *
     * @param Specialty_Rebrand_Loader $loader The loader instance for managing hooks.
     */
    public function define_hooks($loader) {
        // Use 'init' to create the page early in the WP lifecycle
        $loader->add_action('init', $this, 'register_admin_pages');

        // Swap in a custom template if the current page is specialties-admin
        $loader->add_filter('template_include', $this, 'specialties_admin_template');

        // Protect the route so only administrators can access it
        $loader->add_action('template_redirect', $this, 'restrict_specialties_admin_page');
    }

    /**
     * Create the /specialties-admin page programmatically if it doesn't already exist.
     * This ensures the route exists without requiring manual page creation.
     */
    public function register_admin_pages() {
        $page = get_page_by_path('specialties-admin');

        // If the page doesn't exist, create it
        if (!$page) {
            $page_id = wp_insert_post([
                'post_title'   => 'Specialties Admin',
                'post_name'    => 'specialties-admin', // URL slug
                'post_content' => '',                  // React app renders here
                'post_status'  => 'publish',
                'post_type'    => 'page',
                'post_author'  => get_current_user_id(),
            ]);

            // Log error if the page fails to be created
            if (is_wp_error($page_id)) {
                error_log('Failed to create Specialties Admin page: ' . $page_id->get_error_message());
            }
        }
    }

    /**
     * Load a custom PHP template file when the /specialties-admin page is accessed.
     *
     * @param string $template The current template path.
     * @return string Modified template path if matched.
     */
    public function specialties_admin_template($template) {
        if (is_page('specialties-admin')) {
            $custom_template = plugin_dir_path(__FILE__) . '../views/specialties-admin.php';
            if (file_exists($custom_template)) {
                return $custom_template;
            }
        }
        return $template;
    }

    /**
     * Prevent access to the /specialties-admin page if user is not an admin.
     * This keeps the route secure even though it's publicly accessible.
     */
    public function restrict_specialties_admin_page() {
        if (is_page('specialties-admin') && !current_user_can('manage_options')) {
            wp_die(__('You do not have permission to access this page.', 'specialty-rebrand'));
        }
    }
}
?>
