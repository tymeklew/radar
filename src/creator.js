const ns = "http://www.w3.org/2000/svg";
const COMPLETE_ANGLE = 2 * Math.PI;

class Creator {
  constructor(width, height) {
    // Initate the svg
    this.svg = document.createElementNS(ns, "svg");
    this.svg.setAttribute("width", width);
    this.svg.setAttribute("height", height);

    // Radius of the label points in the graph
    this.point_radius = 2;
    // Size of the text element in the graph
    this.label_size = 5;
    this.width = width;
    this.height = height;
    this.maxValue = 0;

    // Array of labels for the graph
    // E.G ["Geography", "Physics"]
    this.labels = [];
    /// Array of data points must match the length of the labels
    // E.G [[5 , 10] , [7 , 9]]
    this.data = [];
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

  // Function to render the svg to the class but not to the DOM
  render() {
    // Dont render if there is no data
    if (this.data.length == 0 || this.labels.length == 0) {
      this.svg.innerHTML = "";
      return;
    }

    // Angle gap between each point theta in rad
    let angle = COMPLETE_ANGLE / this.labels.length;

    const dimensions = this.dimensions();
    const origin = this.originPos();

    // Add each of the labels onto the svg
    this.labels.forEach((text, index) => {
      let label = document.createElementNS(ns, "text");
      label.setAttribute("r", this.point_radius);

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

    document.documentElement.innerHTML = this.ToString();
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
    for (let i = 0; i < 11; i++) {
      const scale = (i / 10) * this.width;

      const polygon = document.createElementNS(ns, "polygon");
      polygon.setAttribute("stroke", "#000000");
      polygon.setAttribute("opacity", 0.4);
      polygon.setAttribute("fill", "none");

      let points = "";

      this.labels.forEach((_, index) => {
        let width = (i / 10) * dimensions.width;
        let height = (i / 10) * dimensions.height;

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
    let polygon = document.createElementNS(ns, "polygon");

    polygon.setAttribute("fill", "#fff000");
    polygon.setAttribute("fill-opacity", 0.3);
    polygon.setAttribute("stroke", "#ff0000");

    const angle = (2 * Math.PI) / this.labels.length;
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

      points += `${x},${y} `;
    }

    polygon.setAttribute("points", points);

    return polygon;
  }

  label(label, x, y) {
    const text = document.createElementNS(ns, "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("font-size", this.label_size);

    text.textContent = label;
    return text;
  }

  ToString() {
    return this.svg.outerHTML;
  }
}
