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
	let _coloursByCategoryKeys
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
	
	class BarChartColoursByKeys extends HTMLElement {
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
			if ("coloursByCategoryKeys" in changedProperties) {
				this._coloursByCategoryKeys = changedProperties["coloursByCategoryKeys"];
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
				chart.data = [{
					"category_id": "2005",
					"category": "2005",
					"measure": "Sales",
					"value": 23.5
				}, {
					"category_id": "2006",
					"category": "2006",
					"measure": "Sales",
					"value": 26.2
				}, {
					"category_id": "2007",
					"category": "2007",
					"measure": "Sales",
					"value": 30.1
				}, {
					"category_id": "2008",
					"category": "2008",
					"measure": "Sales",
					"value": 29.5
				}, {
					"category_id": "2009",
					"category": "2009",
					"measure": "Sales",
					"value": 24.6
				}];
			} else {
				var newDataSourceObj = JSON.parse(this.datasourceString);
				var newData = []
				for(var i = 0; i < newDataSourceObj.length; i++) {
					var dimMemberID = newDataSourceObj[i].dimensions[0].member_id;
					var dimMemberDesc = newDataSourceObj[i].dimensions[0].member_description;
					if(!newData.find(x => x.category_id === dimMemberID)) {
						var newDataObject = {};
						newDataObject.category_id = dimMemberID;
						newDataObject.category = dimMemberDesc;
						newDataObject.measure = newDataSourceObj[i].measure.measure_description;
						newDataObject.value = newDataSourceObj[i].measure.formattedValue;
						newData.push(newDataObject);
					}
				}
				chart.data = newData;
			}
			
			var chartColours = [];
			if(this._coloursByCategoryKeys.trim() !== "") {
				var coloursArray = this._coloursByCategoryKeys.split(";")
				for(var i = 0; i < coloursArray.length; i++) {
					var coloursKeyAndValue = coloursArray[i].split("=");
					chartColours.push({key: coloursKeyAndValue[0], colour: coloursKeyAndValue[1]});
				}
			}
			
			chart.data.forEach(function(o, i) {
				var colourKeyFound = chartColours.find(ck => ck.key === o.category_id)
				if(colourKeyFound) {
					o.colour = colourKeyFound.colour;
				} else {
					o.colour = "DEFAULT";
				}
			});
			
			//create category axis for years
			var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
			categoryAxis.dataFields.category = "category";
			categoryAxis.renderer.inversed = true;
			categoryAxis.renderer.grid.template.strokeOpacity = 0;

			//create value axis for income and expenses
			var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
			valueAxis.renderer.opposite = true;
			valueAxis.renderer.inversed = false;
			valueAxis.renderer.grid.template.strokeOpacity = 0;
			valueAxis.renderer.labels.template.disabled = true

			//create columns
			var series = chart.series.push(new am4charts.ColumnSeries());
			series.dataFields.categoryY = "category";
			series.dataFields.valueX = "value";
			series.columns.template.strokeOpacity = 0;
			series.tooltipText = "{categoryY}: {valueX.value}";

			let valueLabel = series.bullets.push(new am4charts.LabelBullet());
			valueLabel.label.text = "{valueX.value}";
			valueLabel.label.fontSize = 14;
			valueLabel.label.horizontalCenter = "right";
			valueLabel.label.truncate = false;
			valueLabel.label.hideOversized = true;

			categoryAxis.sortBySeries = series;

			series.columns.template.adapter.add("fill", function(fill, target) {
				if (target.dataItem && (target.dataItem.dataContext.colour !== "DEFAULT")) {
					return am4core.color(target.dataItem.dataContext.colour);
				}
				else {
					return fill;
				}
			});
			
			chart.cursor = new am4charts.XYCursor();
			chart.cursor.behavior = "none";
			
		}
	}
customElements.define("com-bva4kor-sac-barchartcoloursbykeys", BarChartColoursByKeys);
})();