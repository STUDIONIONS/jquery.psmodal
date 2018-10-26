module.exports = function(grunt){
	var gc = {
		imageNotyfy: __dirname+'\\src\\notify.png',
		minifyHtml: false,
		minifyCss: false,
		dist: 'docs/assets'
	};
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
	grunt.initConfig({
		globalConfig : gc,
		pkg : grunt.file.readJSON('package.json'),
		less: {
			css: {
				files : {
					'test/css/main.css' : [
						'src/less/main.less'
					],
					'test/css/theme.css' : [
						'src/less/theme.less'
					],
					'test/css/jquery.psmodal.css' : [
						'src/less/jquery.psmodal.less'
					]
				},
				options : {
					compress: gc.minifyCss,
					ieCompat: false
				}
			}
		},
		autoprefixer:{
			options: {
				browsers: ['last 2 versions', 'Android 4', 'ie 8', 'ie 9', 'Firefox >= 27', 'Opera >= 12.0', 'Safari >= 6'],
				cascade: false
			},
			css: {
				expand: true,
				flatten: true,
				src: [
					'test/css/main.css',
					'test/css/theme.css',
					'test/css/jquery.psmodal.css'
				],
				dest: 'test/css/main_pref/'//'assets/templates/skat_<%= pkg.version%>/css/'
			}
		},
		cssmin: {
			target: {
				files: {
					'<%= globalConfig.dist%>/css/main.css': [
						'test/css/main_pref/main.css'
					],
					'<%= globalConfig.dist%>/css/theme.css': [
						'test/css/main_pref/theme.css'
					],
					'<%= globalConfig.dist%>/css/jquery.psmodal.css': [
						'test/css/main_pref/jquery.psmodal.css'
					]
				}
			}
		},
		jshint: {
			src: [
				'src/js/jquery.psmodal.js',
				'src/js/main.js'
			],
		},
		uglify : {
			options: {
				ASCIIOnly: true,
				//beautify: true
			},
			main: {
				files: {
					'<%= globalConfig.dist%>/js/jquery.js': [
						'bower_components/jquery/dist/jquery.js',
					],
					'<%= globalConfig.dist%>/js/main.js': [
						'src/js/main.js',
					],
					'<%= globalConfig.dist%>/js/jquery.psmodal.js': [
						'src/js/jquery.psmodal.js',
					]
				}
			}
		},
		imagemin: {
			base: {
				options: {
					optimizationLevel: 7,
					//progressive: true,
					//interlaced: true,
					svgoPlugins: [
						{
							removeViewBox: false
						}
					]
				},
				files: [
					{
						expand: true,
						cwd: 'src/images/',
						src: ["**/*.{png,jpg,jpeg,gif,svg}"],
						dest: 'test/images/'
					},
				]
			},
		},
		tinyimg: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'test/images/', 
					src: ['**/*.{png,jpg,jpeg,svg}'],
					dest: '<%= globalConfig.dist%>/images/'
				}]
			}
		},
		pug: {
			files: {
				options: {
					pretty: '\t',
					separator:  '\n'
				},
				files: {
					"docs/index.html": ['src/pug/index.pug'],
				}
			}
		},
		/*
		jade: {
			files: {
				options: {
					pretty: !gc.minifyHtml,
					data: {
						debug: false
					}
				},
				files: {
					"index.php": [
						"src/jade/index.jade"
					],
				}
			}
		},
		*/
		watch: {
			options: {
				livereload: true,
			},
			html: {
				files: [
					'src/pug/**/*.php',
					'src/pug/**/*.pug',
					'src/less/**/*.{css,less}',
				],
				tasks: ['notify:watch', 'less', 'autoprefixer','cssmin', "pug","notify:done"]
			},
			js: {
				files: [
					'src/js/**/*.js'
				],
				tasks: [
					'notify:watch',
					'jshint',
					'uglify',
					'notify:done'
				]
			},
			images: {
				files: [
					'src/images/*.{png,jpg,jpeg,gif,svg}',
				],
				tasks: ['notify:watch', 'imagemin', 'tinyimg', 'notify:done']//
			}
		},
		notify: {
			watch: {
				options: {
					title: "<%= pkg.name %> v<%= pkg.version %>",
					message: 'Запуск',
					image: '<%= globalConfig.imageNotyfy %>'
				}
			},
			done: {
				options: { 
					title: "<%= pkg.name %> v<%= pkg.version %>",
					message: "Успешно Завершено",
					image: '<%= globalConfig.imageNotyfy %>'
				}
			}
		}
	});
	grunt.registerTask('default',
		[
			'notify:watch',
			'imagemin',
			'tinyimg',
			'less',
			'autoprefixer',
			'cssmin',
			'jshint',
			'uglify',
			'pug',
			'notify:done'
		]
	);
	grunt.registerTask('dev',
		[
			'watch'
		]
	);
};