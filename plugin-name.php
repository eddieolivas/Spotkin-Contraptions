<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://contraptionmaker.com
 * @since             1.0.0
 * @package           spotkin_contraptions
 *
 * @wordpress-plugin
 * Plugin Name:       Spotkin Contraptions
 * Plugin URI:        http://contraptionmaker.com/
 * Description:       This plugin allows use of the contraptions shortcode which allows you to list contraptions, puzzles, and mods in the Contraption Maker database.
 * Version:           1.0.0
 * Author:            Eddie Olivas
 * Author URI:        http://chrysaliswebdevelopment.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       spotkin-contraptions
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-plugin-name-activator.php
 */
function activate_plugin_name() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-plugin-name-activator.php';
	Plugin_Name_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-plugin-name-deactivator.php
 */
function deactivate_plugin_name() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-plugin-name-deactivator.php';
	Plugin_Name_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_plugin_name' );
register_deactivation_hook( __FILE__, 'deactivate_plugin_name' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-plugin-name.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_plugin_name() {

	$plugin = new Plugin_Name();
	$plugin->run();
	
	//[contraption]
		function contraption_func( $atts ){
			$num = rand ( 0 , 100 );
			
			$a = shortcode_atts( array(
				'type' => 'contraption',
				'curation' => '',
				'size' => 'small',
				'name' => '',
				'user' => 'any',
				'sort_by' => 'date',
				'date_range' => '',
				'limit' => '20',
				'id' => $num,
			), $atts );
			
			
			$class = 'cmworkshops';
			
			
			echo "<div class='contraptions'><ul class='cmworkshops ".$a['id']." ".$a['size']."' data-class='".$a['id']."' data-type='".$a['type']."' data-size='".$a['size']."' data-name='".$a['name']."' data-curation='".$a['curation']."' data-user='".$a['user']."' data-sort_by='".$a['sort_by']."' data-daterange='".$a['date_range']."' data-limit='".$a['limit']."'><script>jQuery(document).ready(function() { run('.cmworkshops.".$a['id']."');});</script></ul></div>";
			
		}
		add_shortcode( 'contraption', 'contraption_func' );

}
run_plugin_name();
