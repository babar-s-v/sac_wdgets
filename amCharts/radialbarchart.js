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
				this._firstConnection = 1;
				async function LoadLibs(callme) {
					try {
						await loadScript(amchartscorejs);
						await loadScript(amchartschartsjs);
						await loadScript(amchartsanimatedjs);
					} catch (e) {
						alert(e);
					} finally {
						callme.loadthis();
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
			this.loadthis();
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

			chart.data = [
			  {
				category: "One",
				value1: 8,
				value2: 2,
				value3: 4
			  },
			  {
				category: "Two",
				value1: 11,
				value2: 4,
				value3: 2
			  },
			  {
				category: "Three",
				value1: 7,
				value2: 6,
				value3: 6
			  },
			  {
				category: "Four",
				value1: 13,
				value2: 8,
				value3: 3
			  },
			  {
				category: "Five",
				value1: 12,
				value2: 10,
				value3: 5
			  },
			  {
				category: "Six",
				value1: 15,
				value2: 12,
				value3: 4
			  }
			];

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
			valueAxis.min = 0;
			valueAxis.max = 35;
			valueAxis.strictMinMax = false;
			valueAxis.renderer.maxLabelPosition = 1;
			valueAxis.renderer.minGridDistance = 10;
			valueAxis.renderer.grid.template.strokeOpacity = 0.07;
			valueAxis.renderer.axisFills.template.disabled = true;
			valueAxis.interactionsEnabled = false;

			var series1 = chart.series.push(new am4charts.RadarColumnSeries());
			series1.columns.template.tooltipText = "{name}: {valueX.value}";
			series1.name = "Net Promoter Score";
			series1.dataFields.categoryY = "category";
			series1.dataFields.valueX = "value1";
			series1.stacked = true;

			var series2 = chart.series.push(new am4charts.RadarColumnSeries());
			series2.columns.template.tooltipText = "{name}: {valueX.value}";
			series2.name = "Detractors";
			series2.dataFields.categoryY = "category";
			series2.dataFields.valueX = "value2";
			series2.stacked = true;

			var series3 = chart.series.push(new am4charts.RadarColumnSeries());
			series3.columns.template.tooltipText = "{name}: {valueX.value}";
			series3.name = "Promoter";
			series3.dataFields.categoryY = "category";
			series3.dataFields.valueX = "value3";
			series3.stacked = true;
			
			chart.seriesContainer.zIndex = -1;
			
			var seriesColors = this._series1Color.split(";");
			for(var sc = 0; sc < seriesColors.length; sc++) {
				if(sc == 0) series1.columns.template.fill = am4core.color(seriesColors[0]);
				if(sc == 1) series2.columns.template.fill = am4core.color(seriesColors[1]);
				if(sc == 2) series3.columns.template.fill = am4core.color(seriesColors[2]);
			}
			
			chart.endAngle = 180;
			chart.innerRadius = am4core.percent(20);

			chart.cursor = new am4charts.RadarCursor();
			chart.cursor.lineY.disabled = true;

		}
	
	}

	customElements.define("com-bva4kor-sac-radialbarchart", RadialBarChart);
})();
