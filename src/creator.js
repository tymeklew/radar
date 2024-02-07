const ns = "http://www.w3.org/2000/svg";

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

    // Array of labels for the graph
    // E.G ["Geography", "Physics"]
    this.labels = [];
    /// Array of data points must match the length of the labels
    // E.G [[5 , 10] , [7 , 9]]
    this.data = [];
  }

  addLabel(label) {
    this.labels.push(label);
    this.render();
  }

  /// Add data to the graph
  addData(data) {
    //Sanatize the data and ensure it has the right amount of data points
    this.data.push(data);
    this.render();
  }

  // Function to render the svg to the class but not to the DOM
  render() {
    // Dont render if there is no data
    if (this.data.length == 0 || this.labels.length == 0) {
      this.svg.innerHTML = "";
      return;
    }

    // Position of the origin of which all the points are based
    let originPos = this.width / 2 - this.point_radius * 4;
    // Angle gap between each point theta in rad
    let angle = (2 * Math.PI) / this.labels.length;

    // Add each of the labels onto the svg
    this.labels.forEach((_, index) => {
      let point = document.createElementNS(ns, "circle");
      point.setAttribute("r", this.point_radius);

      // Calculate the x and y coords of the point
      let x =
        this.width / 2 + originPos * Math.cos(angle * index - Math.PI / 2);
      let y =
        this.width / 2 + originPos * Math.sin(angle * index - Math.PI / 2);

      point.setAttribute("cx", x);
      point.setAttribute("cy", y);

      this.svg.appendChild(point);
    });

    this.data.forEach((data) => {
      this.svg.appendChild(this.polygon(data));
    });

    this.svg.appendChild(this.scale());

    document.documentElement.innerHTML = this.ToString();
  }

  // Render a scale onto the graph
  scale() {
    let grouping = document.createElementNS(ns, "g");

    let angle = (2 * Math.PI) / this.labels.length;
    // Position of the origin of which all the points are based
    let originPos = this.width / 2 - this.point_radius * 4;

    // Render the vertical lines directly to the labels
    this.labels.forEach((_, index) => {
      const line = document.createElementNS(ns, "line");

      line.setAttribute("stroke", "black");
      line.setAttribute("stroke-width", 1);
      line.setAttribute("opacity", 0.3);

      line.setAttribute("x1", this.width / 2);
      line.setAttribute("y1", this.width / 2);
      line.setAttribute(
        "x2",
        this.width / 2 + originPos * Math.cos(angle * index - Math.PI / 2),
      );
      line.setAttribute(
        "y2",
        this.width / 2 + originPos * Math.sin(angle * index - Math.PI / 2),
      );

      grouping.appendChild(line);
    });

    // Render the horizontal scale lines
    for (let i = 0; i < 10; i++) {
      let scale = (originPos * (i + 1)) / 10;
      const polygon = document.createElementNS(ns, "polygon");

      polygon.setAttribute("fill", "none");
      polygon.setAttribute("stroke", "black");
      polygon.setAttribute("stroke-width", 1);
      polygon.setAttribute("opacity", 0.3);

      let points = "";

      for (let i = 0; i < this.labels.length; i++) {
        let x = this.width / 2 + scale * Math.cos(angle * i - Math.PI / 2);
        let y = this.width / 2 + scale * Math.sin(angle * i - Math.PI / 2);

        points += `${x},${y} `;
      }

      polygon.setAttribute("points", points);
      grouping.appendChild(polygon);
    }

    return grouping;
  }

  // Render the polygon onto the graph for the data points
  polygon(data) {
    let polygon = document.createElementNS(ns, "polygon");

    polygon.setAttribute("fill", "none");
    polygon.setAttribute("stroke", "#ff0000");

    let angle = (2 * Math.PI) / this.labels.length;

    let points = "";
    for (let i = 0; i < this.labels.length; i++) {
      let x = this.width / 2 + data[i] * 8 * Math.cos(angle * i - Math.PI / 2);
      let y = this.width / 2 + data[i] * 8 * Math.sin(angle * i - Math.PI / 2);
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
