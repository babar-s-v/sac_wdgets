(function()  {
	let template = document.createElement("template");
	template.innerHTML = `
		<table>
			<tr>
				<td>Top chart left position in % from center</td>
			</tr>
			<tr>
				<td><input id="chart1leftpos" type="number" size="2" maxlength="2"></td>
			</tr>
			<tr>
				<td>Bottom chart right position in % from center</td>
			</tr>
			<tr>
				<td><input id="chart2rightpos" type="number" size="2" maxlength="2"></td>
			</tr>
		</table>
	`;

	class TornadoChartStylingPanel extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("chart1leftpos").addEventListener("change", this._submit.bind(this));
			this._shadowRoot.getElementById("chart2rightpos").addEventListener("change", this._submit.bind(this));
		}

		_submit(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							chart1leftposition: this.chart1leftposition,
							chart2rightposition: this.chart2rightposition
						}
					}
			}));
		}

		set chart1leftposition(newValue) {
			this._shadowRoot.getElementById("chart1leftpos").value = newValue;
		}

		get chart1leftposition() {
			return this._shadowRoot.getElementById("chart1leftpos").value;
		}
		
		set chart2rightposition(newValue) {
			this._shadowRoot.getElementById("chart2rightpos").value = newValue;
		}

		get chart2rightposition() {
			return this._shadowRoot.getElementById("chart2rightpos").value;
		}
	}

customElements.define("com-bva4kor-sac-tornado-styling", TornadoChartStylingPanel);
})();