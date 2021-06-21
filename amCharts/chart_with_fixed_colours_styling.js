(function()  {
	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form">
			<fieldset>
				<legend>Bar Chart Colours by Keys Properties</legend>
				<table>
					<tr>
						<td>Color</td>
						<td><textarea id="styling_color" rows="5" cols="40"></td>
					</tr>
				</table>
			</fieldset>
		</form>
	`;

	class BarChartColoursByKeysStylingPanel extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("styling_color").addEventListener("change", this._submit.bind(this));
		}

		_submit(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							coloursByCategoryKeys: this.coloursByCategoryKeys
						}
					}
			}));
		}

		set coloursByCategoryKeys(newColor) {
			this._shadowRoot.getElementById("styling_color").value = newColor;
		}

		get coloursByCategoryKeys() {
			return this._shadowRoot.getElementById("styling_color").value;
		}
	}

customElements.define("com-bva4kor-sac-barchartcoloursbykeys-styling", BarChartColoursByKeysStylingPanel);
})();