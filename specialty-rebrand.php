<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://moxcar.com
 * @since             1.0.0
 * @package           Specialty_Rebrand
 *
 * @wordpress-plugin
 * Plugin Name:       Specialty Rebrand
 * Plugin URI:        https://moxcar.com
 * Description:       This is a description of the plugin.
 * Version:           1.0.0
 * Author:            Gino Peterson
 * Author URI:        https://moxcar.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       specialty-rebrand
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Define plugin directory path and URL
define( 'SPECIALTY_REBRAND_DIR', plugin_dir_path( __FILE__ ) );
define( 'SPECIALTY_REBRAND_URL', plugin_dir_url( __FILE__ ) );

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'SPECIALTY_REBRAND_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-specialty-rebrand-activator.php
 */
function activate_specialty_rebrand() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-specialty-rebrand-activator.php';
	Specialty_Rebrand_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-specialty-rebrand-deactivator.php
 */
function deactivate_specialty_rebrand() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-specialty-rebrand-deactivator.php';
	Specialty_Rebrand_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_specialty_rebrand' );
register_deactivation_hook( __FILE__, 'deactivate_specialty_rebrand' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-specialty-rebrand.php';



add_action('init', function () {
    // Only run for admins to avoid accidental public execution
    if (!current_user_can('manage_options')) return;

    // Only run once per load
    if (get_transient('physician_export_ran')) return;
    set_transient('physician_export_ran', true, 300);

    $physicians = get_posts([
        'post_type'      => 'physician',
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'fields'         => 'ids',
    ]);

    $output = [];

    foreach ($physicians as $post_id) {
        $output[] = [
            'id'    => $post_id,
            'title' => get_the_title($post_id),
        ];
    }

    $json = json_encode($output, JSON_PRETTY_PRINT);

    // Save JSON to plugin directory
    $file = plugin_dir_path(__FILE__) . 'physicians.json';
    file_put_contents($file, $json);
});


/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_specialty_rebrand() {

	$plugin = new Specialty_Rebrand();
	$plugin->run();

}
run_specialty_rebrand();
