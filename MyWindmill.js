define( ["jquery","./raphael-min","./windmill","./jquery-ui"], function ( $ ) {
	'use strict';

	return {
		initialProperties: {
			version: 1.3,
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 10,
					qHeight: 500
				}]
			},
			chartOptions:{
				minTime:500,
				maxTime:5000
			}

		},
		//property panel
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1,
					max: 1
				},
				measures: {
					uses: "measures",
					min: 1,
					max: 1
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings",
					items: {
						Windmill: {
							type: "items",
							label: "Windmill",
							items: {
								minSpeed:{
									ref: "minTime",
									expression:"optional",
									translation: "Min rotation time",
									type: "integer",
									defaultValue: 500,
									component: "slider",
									min: 200,
									max: 600,
									step: 10
								},
								maxSpeed:{
									ref: "maxTime",
									expression:"optional",
									translation: "Max rotation time",
									type: "integer",
									defaultValue: 500,
									component: "slider",
									min: 2000,
									max: 10000,
									step: 10
								}


								}
								}
				}
			}
		}
		},
		snapshot: {
			canTakeSnapshot: true
		},

		paint: function ( $element, layout ) {

			//add your rendering code here
		  	var self = this,
				data={},
				html='<div id="main">',
				dimensions = layout.qHyperCube.qDimensionInfo,
				matrix = layout.qHyperCube.qDataPages[0].qMatrix;
				console.log(layout.chartOptions.minTime);
			if ( dimensions && dimensions.length > 0 ) {
				matrix.forEach(function ( row ) {

					data[row[0].qElemNumber]= {
						x:row[0].qText,
						y:row[1].qNum,
						chart:new windmill()
					}

					html +="<div class='selectable hooverable' title='"+row[1].qText+"' data-value='"+row[0].qElemNumber+"' id ='"+row[0].qElemNumber+"' style='width:20%;display:inline-block'>"+row[0].qText+"</div>";


				} );
				console.log(self);
				var charts = {};
				var max = layout.qHyperCube.qMeasureInfo[0].qMax;
				var min = layout.qHyperCube.qMeasureInfo[0].qMin;

				var mapRange = function(from, to, s) {
					return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);


				};
			html += "</div>";
			$element.html( html );

			for(var c in data)
			{
				data[c].chart.init(c);
				data[c].chart.options.time= mapRange([min,max],[5000,1000],data[c].y)

			if(data[c].y != 0)
			{
			data[c].chart.start();
		}



		/*	$( ".hooverable" ).hover(
				function() {
					console.log(this);
					$( this ).tooltip();
				}, function() {
					$( this ).find( "span:last" ).remove();
				}
			);*/


		}



			}






			if ( this.selectionsEnabled ) {
				$element.find( '.selectable' ).on( 'qv-activate', function () {
					if ( this.hasAttribute( "data-value" ) ) {
						var value = parseInt( this.getAttribute( "data-value" ), 10 ), dim = 0;
						self.selectValues( dim, [value], true );
						$( this ).toggleClass( "selected" );
					}
				} );
			}
		}
	};

} );
