(function()  {
	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form">
			<table>
				<tr>
					<td>Chart Title</td>
					<td><input id="chart_title" type="text"></td>
				</tr>
				<tr>
					<td>Chart Title Font Size</td>
					<td><input id="chart_title_fontsize" type="number" size="2" maxlength="2"></td>
				</tr>
				<tr>
					<td>1st Chart type</td>
					<td><select id="builder_chart1_type">
						  <option value="line">Line</option>
						  <option value="column">Column</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>2nd Chart type</td>
					<td><select id="builder_chart2_type">
						  <option value="line">Line</option>
						  <option value="column">Column</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>3rd Chart type</td>
					<td><select id="builder_chart3_type">
						  <option value="line">Line</option>
						  <option value="column">Column</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>4th Chart type</td>
					<td><select id="builder_chart4_type">
						  <option value="line">Line</option>
						  <option value="column">Column</option>
						</select>
					</td>
				</tr>
			</table>
			<input type="submit" style="display:none;">
		</form>
		<style>
		:host {
			display: block;
			padding: 1em 1em 1em 1em;
		}
		</style>
	`;

	class XYHorizontalStackedAxesChartBuilderPanel extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
			this._shadowRoot.getElementById("builder_chart1_type").addEventListener("change", this._submit.bind(this));
			this._shadowRoot.getElementById("builder_chart2_type").addEventListener("change", this._submit.bind(this));
			this._shadowRoot.getElementById("builder_chart3_type").addEventListener("change", this._submit.bind(this));
			this._shadowRoot.getElementById("builder_chart4_type").addEventListener("change", this._submit.bind(this));
		}

		_submit(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							title: this.title,
							titlefontsize: this.titlefontsize,
							chart1type: this.chart1type,
							chart2type: this.chart2type,
							chart3type: this.chart3type,
							chart4type: this.chart4type
						}
					}
			}));
		}

		set title(newTitle) {
			this._shadowRoot.getElementById("chart_title").value = newTitle;
		}

		get title() {
			return this._shadowRoot.getElementById("chart_title").value;
		}
		
		set titlefontsize(newTitleFontSize) {
			this._shadowRoot.getElementById("chart_title_fontsize").value = newTitleFontSize;
		}

		get titlefontsize() {
			return this._shadowRoot.getElementById("chart_title_fontsize").value;
		}
		
		set chart1type(newType) {
			this._shadowRoot.getElementById("builder_chart1_type").value = newType;
		}

		get chart1type() {
			return this._shadowRoot.getElementById("builder_chart1_type").value;
		}
		
		set chart2type(newType) {
			this._shadowRoot.getElementById("builder_chart2_type").value = newType;
		}

		get chart2type() {
			return this._shadowRoot.getElementById("builder_chart2_type").value;
		}
		
		set chart3type(newType) {
			this._shadowRoot.getElementById("builder_chart3_type").value = newType;
		}

		get chart3type() {
			return this._shadowRoot.getElementById("builder_chart3_type").value;
		}
		
		set chart4type(newType) {
			this._shadowRoot.getElementById("builder_chart4_type").value = newType;
		}

		get chart4type() {
			return this._shadowRoot.getElementById("builder_chart4_type").value;
		}
	}

	customElements.define("com-bva4kor-sac-xy_horizontal_stacked-builder", XYHorizontalStackedAxesChartBuilderPanel);
})();