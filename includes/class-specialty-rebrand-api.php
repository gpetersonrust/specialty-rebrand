<?php
/**
 * Define the API endpoints for the plugin.
 *
 * @package    Specialty_Rebrand
 * @subpackage Specialty_Rebrand/includes
 */

class Specialty_Rebrand_API {

    /**
     * Register hooks for the API.
     * This ties into WordPress's REST API initialization process.
     *
     * @param Specialty_Rebrand_Loader $loader The loader to define hooks with.
     */
    public function define_hooks($loader) {
        $loader->add_action('rest_api_init', $this, 'register_api_routes');
    }

    /**
     * Register REST API routes for the Specialty Rebrand plugin.
     */
    public function register_api_routes() {
        // GET all specialties, and POST to add a new one
        register_rest_route(
            'specialty-rebrand/v1',
            '/specialties',
            array(
                array(
                    'methods'  => 'GET',
                    'callback' => array($this, 'get_specialties'),
                    // 'permission_callback' => array($this, 'validate_rest_nonce'),
                ),
                array(
                    'methods'  => 'POST',
                    'callback' => array($this, 'create_specialty'),
                    // 'permission_callback' => array($this, 'validate_rest_nonce'),
                ),
            )
        );

        // PUT to update an existing specialty by term ID
        register_rest_route(
            'specialty-rebrand/v1',
            '/specialties/(?P<id>\d+)',
            array(
                'methods'  => 'PUT',
                'callback' => array($this, 'update_specialty'),
                'permission_callback' => array($this, 'validate_rest_nonce'),
                
            )
        );

        // DELETE to remove an existing specialty by term ID
        register_rest_route(
            'specialty-rebrand/v1',
            '/specialties/(?P<id>\d+)',
            array(
                'methods'  => 'DELETE',
                'callback' => array($this, 'delete_specialty'),
                'permission_callback' => array($this, 'validate_rest_nonce'),
            )
        );
    }

    /**
     * Validates the WP REST API nonce to ensure request authenticity.
     * This replaces user permission checks by confirming the request is signed.
     *
     * @return bool
     */
    public function validate_rest_nonce() {
        $nonce = $_SERVER['HTTP_X_WP_NONCE'] ?? '';
        return wp_verify_nonce($nonce, 'wp_rest');
    }

    /**
     * Handle GET request to fetch all specialties.
     * Returns term ID, name, and parent ID.
     *
     * @param WP_REST_Request $request The REST request object.
     * @return WP_REST_Response|WP_Error
     */
public function get_specialties($request) {
    $terms = get_terms(array(
        'taxonomy'   => 'specialty_area',
        'hide_empty' => false,
    ));

    if (is_wp_error($terms)) {
        return new WP_Error('term_fetch_failed', 'Could not fetch specialties', array('status' => 500));
    }

    // Map of all terms by ID
    $term_map = array();

    // Populate each term's structure and store by ID
    foreach ($terms as $term) {
        $decoded_name = html_entity_decode($term->name);

        $term_map[$term->term_id] = array(
            'id'       => $term->term_id,
            'name'     =>  $decoded_name,
            'children' => array(),
        );
    }

    // Final tree structure
    $tree = array();

    // Assign children to their parent, or to root if parent = 0
    foreach ($terms as $term) {
        if ($term->parent && isset($term_map[$term->parent])) {
            $term_map[$term->parent]['children'][] = &$term_map[$term->term_id];
        } else {
            $tree[] = &$term_map[$term->term_id];
        }
    }

    return rest_ensure_response($tree);
}

    /**
     * Handle POST request to create a new specialty.
     * Optionally accepts 'adult_name' to set a parent.
     *
     * @param WP_REST_Request $request The REST request object.
     * @return WP_REST_Response|WP_Error
     */
    public function create_specialty($request) {
        $name = sanitize_text_field($request->get_param('name'));
        $adult_name = sanitize_text_field($request->get_param('adult_name'));

        if (empty($name)) {
            return new WP_Error('missing_name', 'Name is required', array('status' => 400));
        }

        $parent_id = 0;

        // If an adult name was provided, look up the parent term
        if (!empty($adult_name)) {
            $parent_term = get_term_by('name', $adult_name, 'specialty_area');

            if ($parent_term && !is_wp_error($parent_term)) {
                $parent_id = (int) $parent_term->term_id;
            } else {
                return new WP_Error('parent_not_found', 'Adult specialty not found', array('status' => 400));
            }
        }

        // Create the term
        $result = wp_insert_term($name, 'specialty_area', array(
            'parent' => $parent_id,
        ));

        if (is_wp_error($result)) {
            return $result;
        }

        $term = get_term($result['term_id'], 'specialty_area');

        return rest_ensure_response(array(
            'id'         => $term->term_id,
            'name'       => $term->name,
            'parent'     => $parent_id,
            'parentName' => $adult_name,
        ));
    }

    /**
     * Handle PUT request to update an existing specialty's name.
     * Does not allow parent/tier reassignment — just renaming.
     *
     * @param WP_REST_Request $request The REST request object.
     * @return WP_REST_Response|WP_Error
     */
    public function update_specialty($request) {
        $id = (int) $request['id'];
        $name = sanitize_text_field($request->get_param('name'));

        if (empty($name)) {
            return new WP_Error('missing_name', 'Name is required', array('status' => 400));
        }

        $result = wp_update_term($id, 'specialty_area', array('name' => $name));

        if (is_wp_error($result)) {
            return $result;
        }

        $term = get_term($id, 'specialty_area');

        return rest_ensure_response(array(
            'id'     => $term->term_id,
            'name'   => $term->name,
            'parent' => $term->parent,
        ));
    }


    /**
     * Handle DELETE request to remove an existing specialty by term ID.
     *
     * @param WP_REST_Request $request The REST request object.
     * @return WP_REST_Response|WP_Error
     */
    public function delete_specialty($request) {
        $id = (int) $request['id'];

        if (empty($id)) {
            return new WP_Error('missing_id', 'Specialty ID is required', array('status' => 400));
        }

        // Check if the term exists
        $term = get_term($id, 'specialty_area');
        if (!$term || is_wp_error($term)) {
            return new WP_Error('term_not_found', 'Specialty not found', array('status' => 404));
        }

        // Delete the term
        $result = wp_delete_term($id, 'specialty_area');

        if (is_wp_error($result)) {
            return $result;
        }

        return rest_ensure_response(array(
            'message' => 'Specialty deleted successfully',
            'id'      => $id,
        ));
    }
}
?>