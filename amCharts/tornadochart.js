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
	
	let _chartTitle;
	let _chartTitleFontSize;
	let _chart1LeftPos;
	let _chart2RightPos;
	const amchartscorejs = "https://cdn.amcharts.com/lib/4/core.js";
	const amchartschartsjs = "https://cdn.amcharts.com/lib/4/charts.js";
	const amchartsanimatedjs = "https://cdn.amcharts.com/lib/4/themes/animated.js"
	
	let template = document.createElement("template");
	template.innerHTML = `
		<div id="chartTitle" style=""></div><br/>
		<div id="chartdiv" style="width: 100%; height: 100%">
			<div id="chart1_div" style="position: relative; width: 50%;height: 50%"></div>
			<div id="chart2_div" style="width: 50%;height: 50%"></div> 
		</div>
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
	
	class TornadoChart extends HTMLElement {
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
			if ("title" in changedProperties) {
				this._chartTitle = changedProperties["title"];
			}
			if ("titlefontsize" in changedProperties) {
				this._chartTitleFontSize = changedProperties["titlefontsize"];
			}
			if ("chart1leftposition" in changedProperties) {
				this._chart1LeftPos = changedProperties["chart1leftposition"];
			}
			if ("chart2rightposition" in changedProperties) {
				this._chart2RightPos = changedProperties["chart2rightposition"];
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

			let myChart1 = this.shadowRoot.getElementById('chart1_div');
			let myChart2 = this.shadowRoot.getElementById('chart2_div');
			var chart1 = am4core.create(myChart1, am4charts.XYChart);
			var chart2 = am4core.create(myChart2, am4charts.XYChart);
			
			var fixedSize = 50;
			this.shadowRoot.getElementById("chart1_div").style.left = (fixedSize - parseFloat(this._chart1LeftPos)) + "%";
			this.shadowRoot.getElementById("chart1_div").style.width = (fixedSize + parseFloat(this._chart1LeftPos)) + "%";
			this.shadowRoot.getElementById("chart2_div").style.right = (fixedSize - parseFloat(this._chart2RightPos)) + "%";
			this.shadowRoot.getElementById("chart2_div").style.width = (fixedSize + parseFloat(this._chart2RightPos)) + "%";
			
			if(this.datasourceString1.trim() === "{}") {
				chart1.data = [{
					"category": "2005",
					"measure" : "Income",
					"value": 23.5
				}, {
					"category": "2006",
					"measure" : "Income",
					"value": 26.2
				}, {
					"category": "2007",
					"measure" : "Income",
					"value": 30.1
				}, {
					"category": "2008",
					"measure" : "Income",
					"value": 29.5
				}, {
					"category": "2009",
					"measure" : "Income",
					"value": 24.6
				}];
				
				chart2.data = [{
					"category": "2007", 
					"measure" : "Expenses",
					"value": 17.2
				}, {
					"category": "2008",
					"measure" : "Expenses",
					"value": 22.8
				}, {
					"category": "2009",
					"measure" : "Expenses",
					"value": 23.9
				}, {
					"category": "2010",
					"measure" : "Expenses",
					"value": 25.1
				}, {
					"category": "2011",
					"measure" : "Expenses",
					"value": 25
				}];
			} else {
				var newDataSourceObjFor1stTop5 = JSON.parse(this.datasourceString1);
				var newDataSourceObjFor2ndTop5 = JSON.parse(this.datasourceString2);
				var newDataFor1stTop5 = [];
				var newDataFor2ndTop5 = []
				for(var i = 0; i < newDataSourceObjFor1stTop5.length; i++) {
					var dimMemberID = newDataSourceObjFor1stTop5[i].dimensions[0].member_id;
					var dimMemberDesc = newDataSourceObjFor1stTop5[i].dimensions[0].member_description;
					if(!newDataFor1stTop5.find(x => x.category_id === dimMemberID)) {
						var newDataObject = {};
						newDataObject.category_id = dimMemberID;
						newDataObject.category = dimMemberDesc;
						newDataObject.measure = newDataSourceObjFor1stTop5[i].measure.measure_description;
						newDataObject.value = newDataSourceObjFor1stTop5[i].measure.formattedValue;
						newDataFor1stTop5.push(newDataObject);
					}
				}
				chart1.data = newDataFor1stTop5;
				
				for(var i = 0; i < newDataSourceObjFor2ndTop5.length; i++) {
					var dimMemberID = newDataSourceObjFor2ndTop5[i].dimensions[0].member_id;
					var dimMemberDesc = newDataSourceObjFor2ndTop5[i].dimensions[0].member_description;
					if(!newDataFor2ndTop5.find(x => x.category_id === dimMemberID)) {
						var newDataObject = {};
						newDataObject.category_id = dimMemberID;
						newDataObject.category = dimMemberDesc;
						newDataObject.measure = newDataSourceObjFor2ndTop5[i].measure.measure_description;
						newDataObject.value = newDataSourceObjFor2ndTop5[i].measure.formattedValue;
						newDataFor2ndTop5.push(newDataObject);
					}
				}
				chart2.data = newDataFor2ndTop5;
			}
			
			//create category axis
			var categoryAxis1 = chart1.yAxes.push(new am4charts.CategoryAxis());
			categoryAxis1.dataFields.category = "category";
			categoryAxis1.renderer.inversed = true;
			categoryAxis1.renderer.grid.template.strokeOpacity = 0;

			//create category axis
			var categoryAxis2 = chart2.yAxes.push(new am4charts.CategoryAxis());
			categoryAxis2.dataFields.category = "category";
			categoryAxis2.renderer.opposite = true;
			categoryAxis2.renderer.inversed = false;
			categoryAxis2.renderer.grid.template.strokeOpacity = 0;

			//create value axis
			var valueAxis1 = chart1.xAxes.push(new am4charts.ValueAxis());
			valueAxis1.renderer.opposite = true;
			valueAxis1.renderer.grid.template.strokeOpacity = 0;

			//create value axis
			var valueAxis2 = chart2.xAxes.push(new am4charts.ValueAxis());
			valueAxis2.renderer.opposite = true;
			valueAxis2.renderer.inversed = true;
			valueAxis2.renderer.grid.template.strokeOpacity = 0;


			//create columns
			var series1 = chart1.series.push(new am4charts.ColumnSeries());
			series1.dataFields.categoryY = "category";
			series1.dataFields.valueX = "value";
			series1.columns.template.strokeOpacity = 0;
			series1.tooltipText = "{categoryY}: {valueX.value}";

			//create columns
			var series2 = chart2.series.push(new am4charts.ColumnSeries());
			series2.dataFields.categoryY = "category";
			series2.dataFields.valueX = "value";
			series2.columns.template.strokeOpacity = 0;
			series2.tooltipText = "{categoryY}: {valueX.value}";


			let valueLabel1 = series1.bullets.push(new am4charts.LabelBullet());
			valueLabel1.label.text = "{valueX.value}";
			valueLabel1.label.fontSize = 16;
			valueLabel1.label.horizontalCenter = "right";
			valueLabel1.label.dx = -10;
			
			let valueLabel2 = series2.bullets.push(new am4charts.LabelBullet());
			valueLabel2.label.text = "{valueX.value}";
			valueLabel2.label.fontSize = 16;
			valueLabel2.label.horizontalCenter = "left";
			valueLabel2.label.dx = 10;
			
			var minPosition1;
			var maxPosition1;
			for(var i = 0; i < chart1.data.length; i++) {
				var obj = chart1.data[i];
				if(i === 0) {
					minPosition1 = obj.value;
					maxPosition1 = obj.value;
				} else {
					if(obj.value < minPosition1) {
						minPosition1 = obj.value;
					}
					if(obj.value > maxPosition1) {
						maxPosition1 = obj.value;
					}
				}
			}
			
			var minPosition2;
			var maxPosition2;
			for(var i = 0; i < chart2.data.length; i++) {
				var obj = chart2.data[i];
				if(i === 0) {
					minPosition2 = obj.value;
					maxPosition2 = obj.value;
				} else {
					if(obj.value < minPosition2) {
						minPosition2 = obj.value;
					}
					if(obj.value > maxPosition2) {
						maxPosition2 = obj.value;
					}
				}
			}
			
			var valueAxisMinVal = Math.floor(Math.min(minPosition1, minPosition2));
			var valueAxisMaxVal = Math.ceil(Math.max(maxPosition1, maxPosition2));
			valueAxis1.min = valueAxisMinVal;
			valueAxis1.max = valueAxisMaxVal;
			valueAxis2.min = valueAxisMinVal;
			valueAxis2.max = valueAxisMaxVal;
			
			valueAxis1.renderer.labels.template.disabled = true;
			valueAxis2.renderer.labels.template.disabled = true;

			categoryAxis1.sortBySeries = series1;
			categoryAxis2.sortBySeries = series2;
			
			chart1.cursor = new am4charts.XYCursor();
			chart1.cursor.behavior = "none";
			
			chart2.cursor = new am4charts.XYCursor();
			chart2.cursor.behavior = "none";
			
		}
	}
customElements.define("com-bva4kor-sac-tornado", TornadoChart);
})();