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
	const amchartscorejs = "https://cdn.amcharts.com/lib/4/core.js";
	const amchartschartsjs = "https://cdn.amcharts.com/lib/4/charts.js";
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
	
	class XYHorizontalStackedAxes extends HTMLElement {
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
			if ("chart1type" in changedProperties) {
				this._chartTitleFontSize = changedProperties["chart1type"];
			}
			if ("chart2type" in changedProperties) {
				this._chartTitleFontSize = changedProperties["chart2type"];
			}
			if ("chart3type" in changedProperties) {
				this._chartTitleFontSize = changedProperties["chart3type"];
			}
			if ("chart4type" in changedProperties) {
				this._chartTitleFontSize = changedProperties["chart4type"];
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

			var chart = am4core.create(myChart, am4charts.XYChart);

			if(this.datasourceString.trim() === "{}") {
				var data = [];
				var value1 = 100;
				var value2 = 200;
				var value3 = 400;
				
				var names = ["Raina",
				  "Demarcus",
				  "Carlo",
				  "Jacinda",
				  "Richie",
				  "Antony",
				  "Amada",
				  "Idalia",
				  "Janella",
				  "Marla",
				  "Curtis",
				  "Shellie",
				  "Meggan",
				  "Nathanael",
				  "Jannette",
				  "Tyrell",
				  "Sheena",
				  "Maranda",
				  "Briana"
				];

				for (var i = 0; i < names.length; i++) {
				  value1 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
				  value2 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
				  value3 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 5);
				  data.push({ category: names[i], measuredescriptions: ["value1", "value2", "value3"], value1: value1, value2:value2, value3:value3 });
				}
				
				chart.data = data;
			} else {
				var newDataSourceObj = JSON.parse(this.datasourceString);
				var newChartData = [];
				for(var i = 0; i < newDataSourceObj.length; i++) {
					var dimMemberID = newDataSourceObj[i].dimensions[0].member_id;
					var dimMemberDesc = newDataSourceObj[i].dimensions[0].member_description;
					var msrObj = newDataSourceObj[i].measure;
					if(!newChartData.find(x => x.category_id === dimMemberID)) {
						var newDataObject = {};
						newDataObject.category_id = dimMemberID;
						newDataObject.category = dimMemberDesc;
						newDataObject.measuredescriptions = [];
						newDataObject.measuredescriptions.push(msrObj.measure_description);
						newDataObject.value1 = msrObj.formattedValue;
						newChartData.push(newDataObject);
					} else {
						var existingObj = newChartData.find(x => x.category_id === dimMemberID);
						existingObj.measuredescriptions.push(msrObj.measure_description);
						var newProp = "value"+existingObj.measuredescriptions.length;
						existingObj[newProp] = msrObj.formattedValue;
					}
				}
				
				chart.data = newChartData;
			}
			
			var interfaceColors = new am4core.InterfaceColorSet();

			// the following line makes value axes to be arranged vertically.
			chart.bottomAxesContainer.layout = "horizontal";
			chart.bottomAxesContainer.reverseOrder = true;

			var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "category";
			categoryAxis.renderer.grid.template.stroke = interfaceColors.getFor("background");
			categoryAxis.renderer.grid.template.strokeOpacity = 1;
			categoryAxis.renderer.grid.template.location = 1;
			categoryAxis.renderer.minGridDistance = 20;

			var series_types = [];
			series_types.push(this.chart1type);
			series_types.push(this.chart2type);
			series_types.push(this.chart3type);
			series_types.push(this.chart4type);
			
			for(var i = 0; i < chart.data[0].measuredescriptions.length; i++) {
				var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
				valueAxis.tooltip.disabled = true;
				valueAxis.renderer.baseGrid.disabled = true;
				if(i < chart.data[0].measuredescriptions.length - 1) {
					valueAxis.marginRight = 30;
				}
				valueAxis.renderer.gridContainer.background.fill = interfaceColors.getFor("alternativeBackground");
				valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;
				valueAxis.renderer.grid.template.stroke = interfaceColors.getFor("background");
				valueAxis.renderer.grid.template.strokeOpacity = 1;
				valueAxis.title.text = chart.data[0].measuredescriptions[i];

				var series;
				if(series_types[i] === "line") {
					series = chart.series.push(new am4charts.LineSeries());
				} else if(series_types[i] === "column") {
					series = chart.series.push(new am4charts.ColumnSeries());
				}
				series.dataFields.categoryY = "category";
				series.dataFields.valueX = "value"+(i+1);
				series.xAxis = valueAxis;
				series.name = "Series "+(i+1);
				var bullet = series.bullets.push(new am4charts.CircleBullet());
				if(series_types[i] === "column") {
					bullet.fillOpacity = 0;
					bullet.strokeOpacity = 0;
				}
				bullet.tooltipText = "{valueX.value}";
			}

			chart.cursor = new am4charts.XYCursor();
			chart.cursor.behavior = "zoomY";

		}
	}
customElements.define("com-bva4kor-sac-xy_horizontal_stacked", XYHorizontalStackedAxes);
})();