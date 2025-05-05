<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://moxcar.com
 * @since      1.0.0
 *
 * @package    Specialty_Rebrand
 * @subpackage Specialty_Rebrand/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Specialty_Rebrand
 * @subpackage Specialty_Rebrand/public
 * @author     Gino Peterson <gpeterson@moxcar.com>
 */
class Specialty_Rebrand_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$this->dynamic_hash = $this->dynamic_hash();
	    $specialty_rebrand_dir = SPECIALTY_REBRAND_URL . 'dist/speciality-rebrand';
		$physicians_dir = SPECIALTY_REBRAND_URL . 'dist/physicians';	
		$this->specialty_rebrand_css = $specialty_rebrand_dir . '/speciality-rebrand' . $this->dynamic_hash . '.css';
		$this->specialty_rebrand_js = $specialty_rebrand_dir . '/speciality-rebrand' . $this->dynamic_hash . '.js';
		$this->physicians_css = $physicians_dir . '/physicians' . $this->dynamic_hash . '.css';
		$this->physicians_js = $physicians_dir . '/physicians' . $this->dynamic_hash . '.js';

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0sas
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Specialty_Rebrand_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Specialty_Rebrand_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		if ( is_page( 68 ) ) {
			wp_enqueue_style( $this->plugin_name . '-physicians', $this->physicians_css, array(), $this->version, 'all' );
		}

		if ( is_page( 'specialties-admin' ) ) {
			wp_enqueue_style( $this->plugin_name, $this->specialty_rebrand_css, array(), $this->version, 'all' );
		}

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Specialty_Rebrand_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Specialty_Rebrand_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		if ( is_page( 68 ) ) {
			wp_enqueue_script( $this->plugin_name . '-physicians', $this->physicians_js, array( 'jquery' ), $this->version, true );
		}

		if ( is_page( 'specialties-admin' ) ) {
			wp_enqueue_script( $this->plugin_name, $this->specialty_rebrand_js, array( 'jquery' ), $this->version, true );

			wp_localize_script(
				$this->plugin_name,
				'specialtyRebrandData',
				array(
					'siteUrl' => site_url(),
					'restUrl' => rest_url(),
					'nonce'   => wp_create_nonce('wp_rest')
				)
			);
		}

	}


	function dynamic_hash() {
		$directory_path = plugin_dir_path(dirname(__FILE__, 1)) . 'dist/app/';
		$files = scandir($directory_path);
		$first_file = '';
		foreach ($files as $file) {
			if (!is_dir($directory_path . $file)) {
				$first_file = $file;
				break;
			}
		}
		$hash_parts = explode('-wp', $first_file);
		$hash = isset($hash_parts[1]) ? $hash_parts[1] : '';
		$hash_parts = explode('.', $hash);
		$hash = isset($hash_parts[0]) ? $hash_parts[0] : '';
		return '-wp' . $hash;
	}

}
