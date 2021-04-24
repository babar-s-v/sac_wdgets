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
	
	class RadialBarChart extends HTMLElement {
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

			
			var chart = am4core.create(myChart, am4charts.RadarChart);
			chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

			if(this.datasourceString.trim() === "{}") {
				chart.data = [
				  {
					category: "One",
					measuredescriptions: ["Net Promoter Score", "Detractors", "Promoter"],
					value1: 8,
					value2: 2,
					value3: 4
				  },
				  {
					category: "Two",
					measuredescriptions: ["Net Promoter Score", "Detractors", "Promoter"],
					value1: 11,
					value2: 4,
					value3: 2
				  },
				  {
					category: "Three",
					measuredescriptions: ["Net Promoter Score", "Detractors", "Promoter"],
					value1: 7,
					value2: 6,
					value3: 6
				  },
				  {
					category: "Four",
					measuredescriptions: ["Net Promoter Score", "Detractors", "Promoter"],
					value1: 13,
					value2: 8,
					value3: 3
				  },
				  {
					category: "Five",
					measuredescriptions: ["Net Promoter Score", "Detractors", "Promoter"],
					value1: 12,
					value2: 10,
					value3: 5
				  },
				  {
					category: "Six",
					measuredescriptions: ["Net Promoter Score", "Detractors", "Promoter"],
					value1: 15,
					value2: 12,
					value3: 4
				  }
				];
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
			
			

			//chart.padding(20, 20, 20, 20);
			chart.colors.step = 4;
			
			var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "category";
			categoryAxis.renderer.labels.template.location = 0.5;
			categoryAxis.renderer.labels.template.horizontalCenter = "right";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.tooltipLocation = 0.5;
			categoryAxis.renderer.grid.template.strokeOpacity = 0.07;
			categoryAxis.renderer.axisFills.template.disabled = true;
			categoryAxis.interactionsEnabled = false;
			categoryAxis.renderer.minGridDistance = 10;

			var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
			valueAxis.tooltip.disabled = true;
			valueAxis.renderer.labels.template.horizontalCenter = "left";
			valueAxis.min = 0.0;
			var measuresSum = [];
			for(var e = 0; e < chart.data.length; e++) {
				var msrSum = 0;
				for(var m = 0; m < chart.data[0].measuredescriptions.length; m++) {
					var valNum = "value" + (m+1);
					msrSum = msrSum + parseFloat(chart.data[e][valNum])
				}
				measuresSum.push(msrSum);
			}
			valueAxis.max = Math.floor(Math.max(...measuresSum)) * 1.02;
			valueAxis.strictMinMax = false;
			valueAxis.renderer.maxLabelPosition = 1;
			valueAxis.renderer.minGridDistance = Math.floor(valueAxis.max * 0.1);
			valueAxis.renderer.grid.template.strokeOpacity = 0.07;
			valueAxis.renderer.axisFills.template.disabled = true;
			valueAxis.interactionsEnabled = false;

			var seriesColors = this._series1Color.split(";");
			for(var k = 0; k < chart.data[0].measuredescriptions.length; k++) {
				var series1 = chart.series.push(new am4charts.RadarColumnSeries());
				series1.columns.template.tooltipText = "{name}: {valueX.value}";
				series1.name = chart.data[0].measuredescriptions[k];
				series1.dataFields.categoryY = "category";
				series1.dataFields.valueX = "value"+(k+1);
				series1.stacked = true;
				series1.columns.template.fill = am4core.color(seriesColors[k]);
			}
			
			chart.seriesContainer.zIndex = -1;
			
			chart.endAngle = 180;
			chart.innerRadius = am4core.percent(20);

			chart.cursor = new am4charts.RadarCursor();
			chart.cursor.lineY.disabled = true;

		}
	
	}

	customElements.define("com-bva4kor-sac-radialbarchart", RadialBarChart);
})();
