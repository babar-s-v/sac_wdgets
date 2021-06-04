/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */
 
(function() { 
	
	let _series1Color;
	let _chartTitle;
	let _chartTitleFontSize;
	let _yearFilter;
	const amchartscorejs = "https://cdn.amcharts.com/lib/4/core.js";
	const amchartschartsjs = "https://cdn.amcharts.com/lib/4/charts.js";
	const amchartstimelinejs = "https://cdn.amcharts.com/lib/4/plugins/timeline.js";
	const amchartsanimatedjs = "https://cdn.amcharts.com/lib/4/themes/animated.js"
	
	let template = document.createElement("template");
	template.innerHTML = `
		<div id="chartTitle" style=""></div><br/>
		<div id="chartdiv"></div>
	`;

	function loadScript(src) {
		return new Promise(function(resolve, reject) {
			let script = document.createElement('script');
			script.src = src;

			script.onload = () => {
				resolve(script);
			}
			script.onerror = () => reject(new Error(`Script load error for ${src}`));

			document.head.appendChild(script)
		});
	}
	
	class FishboneTimeline extends HTMLElement {
		constructor() {
			super(); 
			let shadowRoot = this.attachShadow({mode: "open"});
			shadowRoot.appendChild(template.content.cloneNode(true));
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			this._props = {};
			this._firstConnection = 0;
		}
		
		connectedCallback() {
			if (this._firstConnection === 0) {
				async function LoadLibs(that) {
					try {
						await loadScript(amchartscorejs);
						await loadScript(amchartschartsjs);
						await loadScript(amchartstimelinejs);
						await loadScript(amchartsanimatedjs);
					} catch (e) {
						console.log(e);
					} finally {
						that._firstConnection = 1;
						that.loadthis();
					}
				}
				LoadLibs(this);
			}
		}

		onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
		}
		
		onCustomWidgetAfterUpdate(changedProperties) {
			if ("color" in changedProperties) {
				this._series1Color = changedProperties["color"];
			}
			if ("title" in changedProperties) {
				this._chartTitle = changedProperties["title"];
			}
			if ("titlefontsize" in changedProperties) {
				this._chartTitleFontSize = changedProperties["titlefontsize"];
			}
			if ("yearfilter" in changedProperties) {
				this._yearFilter = changedProperties["yearfilter"];
			}
			if (this._firstConnection === 1) {
				this.loadthis();
			}
		}
		
		onCustomWidgetResize(width, height){
			if (this._firstConnection === 1) {
				this.loadthis();
			}
        }
		
		loadthis() {
			
			let myChart = this.shadowRoot.getElementById('chartdiv');
			myChart.style.height = this.shadowRoot.host.clientHeight - 20 + "px";
			myChart.style.width = this.shadowRoot.host.clientWidth - 20 + "px";
			
			if(this._chartTitle && this._chartTitle.trim() !== "") {
				var chartTitle = this.shadowRoot.getElementById('chartTitle');
				chartTitle.innerText = this._chartTitle.trim();
				if(this._chartTitleFontSize && this._chartTitleFontSize > 0) {
					chartTitle.style.fontSize = this._chartTitleFontSize + "px";
				} 
				myChart.style.height = myChart.clientHeight - chartTitle.clientHeight - 10 + "px";
				myChart.style.top = chartTitle.clientHeight - 10 + "px"; 
			}
			
			// Themes begin
			am4core.useTheme(am4themes_animated);
			// Themes end

			
			var chart = am4core.create(myChart, am4plugins_timeline.CurveChart);
			chart.curveContainer.padding(0, 100, 0, 120);
			chart.maskBullets = false;
			
			var colorSet = new am4core.ColorSet();

			if(this.datasourceStringforyear.trim() === "{}") {
				chart.data = [{
					"category": "",
					"year": "1990",
					"size": 13,
					"text": "Lorem ipsum dolor"
				  }, {
					"category": "",
					"year": "1995",
					"size": 5,
					"text": "Sit amet"
				  }, {
					"category": "",
					"year": "2000",
					"size": 9,
					"text": "Consectetur adipiscing elit"
				  }, {
					"category": "",
					"year": "2005",
					"size": 12,
					"text": "Sed do eiusmod"
				  }, {
					"category": "",
					"year": "2010",
					"size": 3,
					"text": "Tempor incididunt"
				  }, {
					"category": "",
					"year": "2015",
					"size": 9,
					"text": "Ut labore et dolore"
				  }, {
					"category": "",
					"year": "2020",
					"size": 4,
					"text": "Magna aliqua"
				  }, {
					"category": "",
					"year": "2025",
					"size": 3,
					"text": "Ut enim ad minim veniam"
				  }, {
					"category": "",
					"size": 10,
					"year": "2030",
					"text": "Quis nostrud exercitation"
				  }
				];
			} else {
				var dynamicData;
				if(this._yearFilter === 0) {
					dynamicData = JSON.parse(this.datasourceStringforyear);
				} else {
					dynamicData = JSON.parse(this.datasourceStringformonth);
				}
				var newData = []
				dynamicData.forEach(function(co, ci) {
					var _member_desc = co.dimensions[0].member_description.replace("(", "").replace(")", "");
					if(_member_desc.indexOf("(all)") !== -1) {
						var newData_ins_Obj = {"category": ""};
						newData_ins_Obj.year = co.dimensions[0].member_description.replace("(", "").replace(")", "");
						newData_ins_Obj.size = co.measure.formattedValue;
						newData.push(newData_ins_Obj);
					}
				});
				chart.data = newData;
			}
			
			
			chart.fontSize = 11;
			chart.tooltipContainer.fontSize = 11;

			var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "category";
			categoryAxis.renderer.grid.template.disabled = true;

			var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
			dateAxis.renderer.points = [{ x: Math.ceil(myChart.clientHeight * -0.666), y: 0 }, { x: 0, y: Math.ceil(myChart.clientHeight * 0.085) }, { x: Math.ceil(myChart.clientHeight * 0.666), y: 0 }]
			dateAxis.renderer.polyspline.tensionX = Math.ceil(dateAxis.renderer.points[2].x * 0.002);
			dateAxis.renderer.grid.template.disabled = true;
			dateAxis.renderer.line.strokeDasharray = "1,4";
			dateAxis.baseInterval = {period:"day", count:1}; // otherwise initial animation will be not smooth

			dateAxis.renderer.labels.template.disabled = true;

			var series = chart.series.push(new am4plugins_timeline.CurveLineSeries());
			series.strokeOpacity = 0;
			series.dataFields.dateX = "year";
			series.dataFields.categoryY = "category";
			series.dataFields.value = "size";
			series.baseAxis = categoryAxis;

			var interfaceColors = new am4core.InterfaceColorSet();

			series.tooltip.pointerOrientation = "down";

			var distance = 100;
			var angle = 60;

			var bullet = series.bullets.push(new am4charts.Bullet());

			var line = bullet.createChild(am4core.Line);
			line.adapter.add("stroke", function(fill, target) {
			  if (target.dataItem) {
				return chart.colors.getIndex(target.dataItem.index)
			  }
			});

			line.x1 = 0;
			line.y1 = 0;
			line.y2 = 0;
			line.x2 = distance - 10;
			line.strokeDasharray = "1,3";

			var circle = bullet.createChild(am4core.Circle);
			circle.radius = 30;
			circle.fillOpacity = 1;
			circle.strokeOpacity = 0;

			var circleHoverState = circle.states.create("hover");
			circleHoverState.properties.scale = 1.3;

			series.heatRules.push({ target: circle, min: 20, max: 50, property: "radius" });
			circle.adapter.add("fill", function(fill, target) {
			  if (target.dataItem) {
				return chart.colors.getIndex(target.dataItem.index)
			  }
			});
			circle.tooltipText = "{value}";
			circle.adapter.add("tooltipY", function(tooltipY, target){
			  return -target.pixelRadius - 4;
			});

			var yearLabel = bullet.createChild(am4core.Label);
			yearLabel.text = "{year}";
			yearLabel.strokeOpacity = 0;
			yearLabel.fill = am4core.color("#fff");
			yearLabel.horizontalCenter = "middle";
			yearLabel.verticalCenter = "middle";
			yearLabel.interactionsEnabled = false;

			var label = bullet.createChild(am4core.Label);
			label.propertyFields.text = "text";
			label.strokeOpacity = 0;
			label.horizontalCenter = "right";
			label.verticalCenter = "middle";

			label.adapter.add("opacity", function(opacity, target) {
			  if(target.dataItem){
				var index = target.dataItem.index;
				var line = target.parent.children.getIndex(0);

				if (index % 2 == 0) {
				  target.y = -distance * am4core.math.sin(-angle);
				  target.x = -distance * am4core.math.cos(-angle);
				  line.rotation = -angle - 180;
				  target.rotation = -angle;
				}
				else {
				  target.y = -distance * am4core.math.sin(angle);
				  target.x = -distance * am4core.math.cos(angle);
				  line.rotation = angle - 180;
				  target.rotation = angle;
				}
			  }
			  return 1;
			});

			var outerCircle = bullet.createChild(am4core.Circle);
			outerCircle.radius = 30;
			outerCircle.fillOpacity = 0;
			outerCircle.strokeOpacity = 0;
			outerCircle.strokeDasharray = "1,3";

			var hoverState = outerCircle.states.create("hover");
			hoverState.properties.strokeOpacity = 0.8;
			hoverState.properties.scale = 1.5;

			outerCircle.events.on("over", function(event){
			  var circle = event.target.parent.children.getIndex(1);
			  circle.isHover = true;
			  event.target.stroke = circle.fill;
			  event.target.radius = circle.pixelRadius;
			  event.target.animate({property: "rotation", from: 0, to: 360}, 4000, am4core.ease.sinInOut);
			});

			outerCircle.events.on("out", function(event){
			  var circle = event.target.parent.children.getIndex(1);
			  circle.isHover = false;
			});

		}
	}
customElements.define("com-bva4kor-sac-fishbonetimeline", FishboneTimeline);
})();