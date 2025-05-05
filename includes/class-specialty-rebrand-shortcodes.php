<?php
/**
 * Define the Shortcodes for the plugin.
 *
 * @package    Specialty_Rebrand
 * @subpackage Specialty_Rebrand/includes
 */

class Specialty_Rebrand_Shortcodes {

    /**
     * Register hooks for the Shortcodes.
     *
     * @param Specialty_Rebrand_Loader $loader The loader to define hooks with.
     */
    public function define_hooks($loader) {
        $loader->add_action('init', $this, 'register_shortcodes');
    }

    /**
     * Register all shortcodes for the plugin.
     */
    public function register_shortcodes() {
        $shortcodes = array(
            'physician-sub-specialty',
            'another-shortcode',
            'some-custom-view',
        );

        foreach ($shortcodes as $tag) {
            add_shortcode($tag, array($this, 'render_shortcode'));
        }
    }

    /**
     * Render a shortcode by dynamically loading the matching view file.
     *
     * @param array  $atts Shortcode attributes.
     * @param string $content Enclosed content, if any.
     * @param string $tag The shortcode tag that was used.
     * @return string Rendered HTML output.
     */
    public function render_shortcode($atts, $content = '', $tag = '') {
        $atts = shortcode_atts(
            array(
                'id' => 0, // Default
            ),
            $atts,
            $tag
        );

        ob_start();

        $safe_tag = sanitize_file_name($tag); // Prevent directory traversal
        $view_file = SPECIALTY_REBRAND_DIR . "/views/shortcodes/{$safe_tag}.php";

        if (file_exists($view_file)) {
            include $view_file;
        } else {
            echo "<p>View file not found for <code>{$safe_tag}</code> shortcode.</p>";
        }

        return ob_get_clean();
    }
}
?>