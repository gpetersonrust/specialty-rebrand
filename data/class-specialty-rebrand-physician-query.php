<?php
/**
 * Handles physician queries for specialties and tiers.
 *
 * @package Specialty_Rebrand
 * @subpackage Specialty_Rebrand/includes
 */

class Specialty_Rebrand_Physician_Query {

    private $tier_list = [
        'non-surgical' => 2,
        'offer'        => 3,
    ];

    /**
     * Returns physicians by term slug (single term, no children).
     */
    public function get_physicians_by_term_slug($term_slug = null) {

 
       
        $args = [
            'post_type' => 'physician',
            'posts_per_page' => -1,
        ];

        if ($term_slug) {
            $args['tax_query'] = [
                [
                    'taxonomy' => 'specialty_area',
                    'field' => 'slug',
                    'terms' => $term_slug,
                    'include_children' => false,
                ],
            ];
        }

 
        $query = new WP_Query($args);
        $posts = [];

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $posts[] = [
                    'name' => get_the_title(),
                    'job_title' => get_field('title'),
                    'featured_image' => get_the_post_thumbnail_url(get_the_ID(), 'full'),
                    'permalink' => get_permalink(),
                    'specialties' => wp_get_post_terms(get_the_ID(), 'specialty_area', ['fields' => 'names']),
                    'id' => get_the_ID(),
                    'locations' => trim(preg_replace('/\s+/', ' ', wp_strip_all_tags(get_field('office_location')))),
                ];
            }
            wp_reset_postdata();
        }

        usort($posts, [$this, 'sort_by_last_name']);
        return $posts;
    }

    /**
     * Returns child terms with physicians, organized by tier.
     */
    public function get_child_terms_with_physicians($term_id) {
        $children = get_term_children($term_id, 'specialty_area');
        
        $result = [];

        foreach ($children as $child_id) {
            $child = get_term($child_id, 'specialty_area');
            $tier  = 1;

            foreach ($this->tier_list as $keyword => $tier_value) {
                if (stripos($child->slug, $keyword) !== false) {
                    $tier = $tier_value;
                    break;
                }
            }

            $result[] = [
                'term'  => $child,
                'tier'  => $tier,
                'posts' => $this->get_physicians_by_term_slug($child->slug),
            ];
        }

        return $result;
    }

    /**
     * Name sort helper.
     */
    private function sort_by_last_name($a, $b) {
        $parse = function ($name) {
            $parts = explode(' ', $name);
            $suffixes = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];
            $last = array_pop($parts);
            if (in_array($last, $suffixes)) $last = array_pop($parts);
            return ['last' => $last, 'first' => implode(' ', $parts)];
        };

        $nameA = $parse($a['name']);
        $nameB = $parse($b['name']);

        $cmp = strcasecmp($nameA['last'], $nameB['last']);
        return $cmp === 0 ? strcasecmp($nameA['first'], $nameB['first']) : $cmp;
    }


    
}
?>