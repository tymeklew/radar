const ns = "http://www.w3.org/2000/svg";
const COMPLETE_ANGLE = 2 * Math.PI;

class Creator {
	constructor(width, height) {
		// Initate the svg
		this.svg = document.createElementNS(ns, "svg");
		this.svg.setAttribute("width", width);
		this.svg.setAttribute("height", height);

		// Size of the text element in the graph
		this.label_size = 30;
		this.width = width;
		this.height = height;
		// Where the creator will render the graph on the DOM
		this.targetElement = null;

		// Settings for the scale lines
		this.labelLines = 10;

		// Array of labels for the graph
		// E.G ["Geography", "Physics"]
		this.labels = [];
		/// Array of data points must match the length of the labels
		// E.G [[5 , 10] , [7 , 9]]
		this.data = [];
	}

	setTargetElement(element) {
		this.targetElement = element;
	}

	// Retunrs origional position of the graph
	originPos() {
		return {
			x: this.width / 2,
			y: this.height / 2,
		};
	}

	// Returns dimensions of the graph
	dimensions() {
		return {
			width: (this.width / 2) * 0.8,
			height: (this.height / 2) * 0.8,
		};
	}

	// Add a label to the graph
	addLabel(label) {
		this.labels.push(label);
		this.render();
	}

	/// Add data to the graph
	addData(data) {
		//Sanatize the data and ensure it has the right amount of data points
		this.data.push(data);
		this.updateMaxDataValue();
		this.render();
	}

	// Update the max data value
	updateMaxDataValue() {
		this.maxValue = Math.max(...this.data.map((data) => Math.max(...data)));
	}

	render() {
		this.svg.innerHTML = "";
		// Dont render if there is no data
		if (this.data.length == 0 || this.labels.length == 0) {
			return;
		}

		// Angle gap between each point theta in rad
		let angle = COMPLETE_ANGLE / this.labels.length;

		const dimensions = this.dimensions();
		const origin = this.originPos();

		// Add each of the labels onto the svg
		this.labels.forEach((text, index) => {
			let label = document.createElementNS(ns, "text");

			const x =
				origin.x +
				dimensions.width * Math.cos(angle * index - COMPLETE_ANGLE / 4);
			const y =
				origin.y +
				dimensions.height * Math.sin(angle * index - COMPLETE_ANGLE / 4);

			label.setAttribute("x", x);
			label.setAttribute("y", y);
			label.setAttribute("font-size", this.label_size);

			label.textContent = text;

			this.svg.appendChild(label);
		});

		// Add the data to the graph
		this.data.forEach((data) => {
			this.svg.appendChild(this.renderPolygon(data));
		});

		this.svg.appendChild(this.renderScale());

		this.targetElement.innerHTML = this.svg.outerHTML;
	}

	// Render a scale onto the graph
	renderScale() {
		let grouping = document.createElementNS(ns, "g");

		let angle = COMPLETE_ANGLE / this.labels.length;
		const origin = this.originPos();
		const dimensions = this.dimensions();

		// Render the vertical lines directly to the labels
		this.labels.forEach((_, index) => {
			const line = document.createElementNS(ns, "line");

			line.setAttribute("stroke", "#000000");
			line.setAttribute("opacity", 0.4);
			line.setAttribute("x1", origin.x);
			line.setAttribute("y1", origin.y);

			const x =
				origin.x +
				dimensions.width * Math.cos(angle * index - COMPLETE_ANGLE / 4);
			const y =
				origin.x +
				dimensions.height * Math.sin(angle * index - COMPLETE_ANGLE / 4);

			line.setAttribute("x2", x);
			line.setAttribute("y2", y);

			grouping.appendChild(line);
		});

		// Render the polygons onto the graph for the data points scaling
		for (let i = 0; i <= this.labelLines; i++) {
			const polygon = document.createElementNS(ns, "polygon");
			polygon.setAttribute("stroke", "#000000");
			polygon.setAttribute("opacity", 0.4);
			polygon.setAttribute("fill", "none");

			let points = "";

			this.labels.forEach((_, index) => {
				let scale = i / this.labelLines;

				let width = scale * dimensions.width;
				let height = scale * dimensions.height;

				const x =
					origin.x + width * Math.cos(angle * index - COMPLETE_ANGLE / 4);
				const y =
					origin.y + height * Math.sin(angle * index - COMPLETE_ANGLE / 4);
				points += `${x},${y} `;
			});
			polygon.setAttribute("points", points);

			grouping.appendChild(polygon);
		}

		return grouping;
	}

	// Render the polygon onto the graph for the data points
	renderPolygon(data) {
		let grouping = document.createElementNS(ns, "g");
		let polygon = document.createElementNS(ns, "polygon");

		polygon.setAttribute("fill", "#ff0000");
		polygon.setAttribute("fill-opacity", 0.2);
		polygon.setAttribute("stroke", "#ff0000");

		const angle = COMPLETE_ANGLE / this.labels.length;
		const origin = this.originPos();
		const dimensions = this.dimensions();

		let points = "";
		for (let i = 0; i < this.labels.length; i++) {
			const x =
				origin.x +
				(data[i] / this.maxValue) *
				dimensions.width *
				Math.cos(angle * i - COMPLETE_ANGLE / 4);
			const y =
				origin.y +
				(data[i] / this.maxValue) *
				dimensions.height *
				Math.sin(angle * i - COMPLETE_ANGLE / 4);

			let point = document.createElementNS(ns, "circle");
			point.setAttribute("cx", x);
			point.setAttribute("cy", y);
			point.setAttribute("r", 5);
			point.setAttribute("fill", "#ff0000");
			point.setAttribute("fill-opacity", 1);

			grouping.appendChild(point);

			points += `${x},${y} `;
		}

		polygon.setAttribute("points", points);
		grouping.appendChild(polygon);

		return grouping;
	}

	label(label, x, y) {
		const text = document.createElementNS(ns, "text");
		text.setAttribute("x", x);
		text.setAttribute("y", y);
		text.setAttribute("font-size", this.label_size);

		text.textContent = label;
		return text;
	}

	// Gets the download link this is what is used to download the file
	downloadLink() {
		let serializer = new XMLSerializer();
		let source = serializer.serializeToString(this.svg);

		return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
	}

	ToString() {
		return this.svg.outerHTML;
	}
}

export default Creator;
