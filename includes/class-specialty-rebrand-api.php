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
        // Define routes and their configurations
        $routes = array(
            // Specialty routes
            array(
            'route'    => '/specialties',
            'methods'  => 'GET',
            'callback' => 'get_specialties',
            'permission_callback' => 'validate_rest_nonce',
            ),
            array(
            'route'    => '/specialties',
            'methods'  => 'POST',
            'callback' => 'create_specialty',
            'permission_callback' => 'validate_rest_nonce',
            ),
            array(
            'route'    => '/specialties/(?P<id>\d+)',
            'methods'  => 'PUT',
            'callback' => 'update_specialty',
            'permission_callback' => 'validate_rest_nonce',
            ),
            array(
            'route'    => '/specialties/(?P<id>\d+)',
            'methods'  => 'DELETE',
            'callback' => 'delete_specialty',
            'permission_callback' => 'validate_rest_nonce',
            ),

            // Assignment routes
            array(
            'route'    => '/assignments',
            'methods'  => 'POST',
            'callback' => 'handle_assignment_action',
            'permission_callback' => 'validate_rest_nonce',
            'args'     => array(
                'physician_ids' => array('required' => true),
                'term_id'       => array('required' => true),
                'action'        => array('required' => true),
            ),
            ),
            array(
                'route'    => '/assignments/by-specialty/(?P<term_id>\\d+)',
                'methods'  => 'GET',
                'callback' => 'get_doctors_by_specialty',
                'permission_callback' => 'validate_rest_nonce',
              ),

              array(
                'route'    => 'export/json',
                'methods'  => 'GET',
                'callback' => 'handle_export_json',
                'permission_callback' => 'validate_rest_nonce',
              ),
              array(
                'route'    => '/import',
                'methods'  => 'POST',
                'callback' => 'handle_import_data',
                'permission_callback' => 'validate_rest_nonce',
              ),
              
        );

        // Loop through the routes and register them
        foreach ($routes as $route) {
            register_rest_route(
            'specialty-rebrand/v1',
            $route['route'],
            array(
                'methods'             => $route['methods'],
                'callback'            => array($this, $route['callback']),
                'permission_callback' => isset($route['permission_callback']) ? array($this, $route['permission_callback']) : null,
                'args'                => $route['args'] ?? array(),
            )
            );
        }
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
        $adult_id = sanitize_text_field($request->get_param('adult_name'));

        if (empty($name)) {
            return new WP_Error('missing_name', 'Name is required', array('status' => 400));
        }

        $parent_id = 0;

        // If an adult name was provided, look up the parent term
        if (!empty($adult_id)) {
            $parent_term = get_term_by('id', $adult_id, 'specialty_area');

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
            'parentName' => $adult_id,
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



    // Assignment methods 

    public function handle_assignment_action($request) {
        $physician_ids = $request->get_param('physician_ids'); // Expecting an array
        $term_id       = (int) $request->get_param('term_id'); // Expecting a single term ID
        $action        = sanitize_text_field($request->get_param('action')); // Expecting 'add' or 'remove'
    
        if (!in_array($action, ['add', 'remove'])) { // Validate action
            return new WP_Error('invalid_action', 'Action must be add or remove', array('status' => 400));
        }
    
        if (!is_array($physician_ids) || empty($physician_ids)) {
            return new WP_Error('invalid_physicians', 'Physician IDs must be an array', array('status' => 400));
        }
    
        $results = [];
    
        foreach ($physician_ids as $physician_id) {
            $physician_id = (int) $physician_id;
    
            if ('add' === $action) {
                $current_terms = wp_get_object_terms($physician_id, 'specialty_area', ['fields' => 'ids']);
                $new_terms = array_unique(array_merge($current_terms, [$term_id]));
                wp_set_object_terms($physician_id, $new_terms, 'specialty_area');
            } else {
                $current_terms = wp_get_object_terms($physician_id, 'specialty_area', ['fields' => 'ids']);
                $new_terms = array_diff($current_terms, [$term_id]);
                wp_set_object_terms($physician_id, $new_terms, 'specialty_area');
            }
    
            // Log action
            $this->log_assignment_action($physician_id, $term_id, $action);
    
            $results[] = array(
                'physician_id' => $physician_id,
                'status'       => 'ok',
            );
        }
    
        return rest_ensure_response($results);
    }


    private function log_assignment_action($physician_id, $term_id, $action) {
        $user_id = get_current_user_id();
        $timestamp = current_time('mysql');
        $log_entry = sprintf("[%s] physician_id: %d, term_id: %d, action: %s, user_id: %d\n",
            $timestamp, $physician_id, $term_id, $action, $user_id
        );
    
        $log_path = SPECIALTY_REBRAND_DIR . '/logs/physician-assignments.log';
        file_put_contents($log_path, $log_entry, FILE_APPEND);
    }


    /**
     * Retrieves doctors (physicians) based on their specialty assignment.
     *
     * This method fetches all physician posts and categorizes them into two groups:
     * - Assigned: Physicians associated with the specified specialty term.
     * - Unassigned: Physicians not associated with the specified specialty term.
     *
     * @param WP_REST_Request $request The REST API request object.
     *                                 Expects a 'term_id' parameter representing the specialty term ID.
     *
     * @return WP_REST_Response A REST API response containing two arrays:
     *                          - 'assigned': List of physicians assigned to the given specialty term.
     *                          - 'unassigned': List of physicians not assigned to the given specialty term.
     *
     * Example Response:
     * {
     *     "assigned": [
     *         {
     *             "id": 123,
     *             "name": "Dr. John Doe"
     *         }
     *     ],
     *     "unassigned": [
     *         {
     *             "id": 456,
     *             "name": "Dr. Jane Smith"
     *         }
     *     ]
     * }
     *
     * Notes:
     * - The 'specialty_area' taxonomy is used to determine the specialty assignment.
     * - All physician posts are retrieved, regardless of their specialty assignment.
     * - Ensure that the 'term_id' parameter is a valid integer.
     */
   
    public function get_doctors_by_specialty($request) {
        $term_id = (int) $request['term_id']; // Get the term ID from the request

        $term_id = absint($term_id); // Sanitize the term ID to ensure it's a positive integer.
        
        // Check if the term exists in the 'specialty_area' taxonomy
        $term = get_term($term_id, 'specialty_area');
        if (!$term || is_wp_error($term)) {
            return new WP_Error('term_not_found', 'The specified specialty term does not exist', array('status' => 404));
        }


    
        // Fetch all physician posts
        $all_physicians = get_posts([
            'post_type'      => 'physician',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
        ]);
    
        $assigned = [];   // Array to store assigned physicians
        $unassigned = []; // Array to store unassigned physicians
    
        // Iterate through all physicians
        foreach ($all_physicians as $physician) {
            // Get the terms assigned to the current physician
            $assigned_terms = wp_get_object_terms($physician->ID, 'specialty_area', ['fields' => 'ids']);
    
            // Prepare physician data
            $doctor_data = [
                'id'   => $physician->ID,
                'name' => get_the_title($physician),
            ];
    
            // Check if the physician is assigned to the given term
            if (in_array($term_id, $assigned_terms)) {
                $assigned[] = $doctor_data; // Add to assigned list
            } else {
                $unassigned[] = $doctor_data; // Add to unassigned list
            }
        }
    
        // Return the response with assigned and unassigned physicians
        return rest_ensure_response([
            'assigned'   => $assigned,
            'unassigned' => $unassigned,
        ]);
    }
    

    public function handle_export_json($request) {
        $terms = get_terms([
            'taxonomy'   => 'specialty_area',
            'hide_empty' => false,
        ]);
    
        $term_data = array_map(function($term) {
            return [
                'id'     => $term->term_id,
                'name'   => $term->name,
                'slug'   => $term->slug,
                'parent' => $term->parent,
            ];
        }, $terms);
    
        $physicians = get_posts([
            'post_type'      => 'physician',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
        ]);
    
        $assignment_data = [];
    
        foreach ($physicians as $post) {
            $physician_id = $post->ID;
            $name = get_the_title($post);
            $term_ids = wp_get_object_terms($physician_id, 'specialty_area', ['fields' => 'ids']);
    
            $assignment_data[] = [
                'physician_id' => $physician_id,
                'name'         => $name,
                'term_ids'     => array_map('intval', $term_ids),
            ];
        }
    
        $payload = [
            'terms'      => $term_data,
            'assignments' => $assignment_data,
        ];
    
        return rest_ensure_response($payload);
    }



   
   public function handle_import_data($request) {
        $data = $request->get_json_params(); // Get the JSON payload
    
        if (!is_array($data) || !isset($data['terms'], $data['assignments'])) {
            return new WP_Error('invalid_payload', 'Malformed JSON data', array('status' => 400));
        }
    
        $imported_terms = array_map('wp_parse_args', $data['terms']);
        $assignments    = array_map('wp_parse_args', $data['assignments']);
    
        $re_mapped_terms = []; // old_id => new_id
        $term_lookup     = []; // old_id => full term data
        $created_terms   = [];
        $skipped_physicians = [];
        $assigned_physicians = [];
    
        // Build lookup map for terms by original ID
        foreach ($imported_terms as $term) {
            $term_id = isset($term['id']) ? (int) $term['id'] : null;
            if ($term_id) {
                $term_lookup[$term_id] = [
                    'name'   => sanitize_text_field($term['name']),
                    'slug'   => sanitize_title($term['slug']),
                    'parent' => isset($term['parent']) ? (int) $term['parent'] : 0,
                ];
            }
        }
    
        // Recursive term importer
        $import_term = function($old_term_id) use (&$import_term, $term_lookup, &$re_mapped_terms, &$created_terms) {
            if (isset($re_mapped_terms[$old_term_id])) {
                return $re_mapped_terms[$old_term_id];
            }
    
            if (!isset($term_lookup[$old_term_id])) {
                return null;
            }
    
            $term = $term_lookup[$old_term_id];
            $resolved_parent = 0;
    
            if ($term['parent'] && isset($term_lookup[$term['parent']])) {
                $resolved_parent = $import_term($term['parent']);
            }
    
            $existing = get_term($old_term_id, 'specialty_area');
            if ($existing && !is_wp_error($existing) &&
                $existing->slug === $term['slug'] &&
                html_entity_decode($existing->name) === $term['name']) {
                $re_mapped_terms[$old_term_id] = $old_term_id;
                return $old_term_id;
            }
    
            $res = wp_insert_term($term['name'], 'specialty_area', [
                'slug'   => $term['slug'],
                'parent' => $resolved_parent,
            ]);
    
            if (is_wp_error($res)) {
                return null;
            }
    
            $new_id = (int) $res['term_id'];
            $re_mapped_terms[$old_term_id] = $new_id;
            $created_terms[] = $new_id;
    
            return $new_id;
        };
    
        // Import top-level terms first
        foreach ($term_lookup as $term_id => $term) {
            if ($term['parent'] === 0) {
                $import_term($term_id);
            }
        }
    
        // Import remaining nested terms
        foreach ($term_lookup as $term_id => $term) {
            $import_term($term_id); // map will short-circuit
        }
    
        // Process physician assignments
        foreach ($assignments as $entry) {
            $physician_id = isset($entry['physician_id']) ? (int) $entry['physician_id'] : 0;
            $physician_name = sanitize_text_field($entry['name'] ?? '');
            $term_ids = array_filter(array_map('intval', $entry['term_ids'] ?? []));
    
            $post = get_post($physician_id);
            if (!$post || $post->post_type !== 'physician' || $post->post_title !== $physician_name) {
                $skipped_physicians[] = $physician_id;
                continue;
            }
    
            $mapped_ids = [];
            foreach ($term_ids as $old_id) {
                $mapped = $re_mapped_terms[$old_id] ?? $old_id;
                $term_check = get_term($mapped, 'specialty_area');
                if ($term_check && !is_wp_error($term_check)) {
                    $mapped_ids[] = $mapped;
                }
            }
    
            wp_set_object_terms($physician_id, $mapped_ids, 'specialty_area');
            $assigned_physicians[] = $physician_id;
        }
    
        return rest_ensure_response([
            'message'             => 'Import completed.',
            'remapped_terms'      => $re_mapped_terms,
            'created_term_count'  => count($created_terms),
            'assigned_physicians' => $assigned_physicians,
            'skipped_physicians'  => $skipped_physicians,
        ]);
    }
    
}
?>