<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://moxcar.com
 * @since      1.0.0
 *
 * @package    Specialty_Rebrand
 * @subpackage Specialty_Rebrand/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Specialty_Rebrand
 * @subpackage Specialty_Rebrand/includes
 * @author     Gino Peterson <gpeterson@moxcar.com>
 */
class Specialty_Rebrand_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'specialty-rebrand',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
