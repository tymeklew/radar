const ns = "http://www.w3.org/2000/svg";

class Creator {
  constructor(width, height) {
    // Initate the svg
    this.svg = document.createElementNS(ns, "svg");
    this.svg.setAttribute("width", width);
    this.svg.setAttribute("height", height);

    // Radius of the label points in the graph
    this.point_radius = 3;
    // Size of the text element in the graph
    this.label_size = 5;
    this.width = width;
    this.height = height;

    // Array of labels for the graph
    // E.G ["Geography", "Physics"]
    this.labels = [];
    /// Array of data points
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
    // Maximum widht of the svg is 2 times the maximum value
    if (this.data.length == 0 || this.labels.length == 0) {
      return;
    }

    let max = this.width / 2 - this.point_radius * 4;
    // Angle gap between each point theta in rad
    let angle = (2 * Math.PI) / this.labels.length;
    // This gives the x and y coordinates of the origin by adding the radius of the max possible of 2 circles and
    // the maxmimum value so it will ajust to the max value of the points
    let offset = max + this.point_radius * 4;

    // Add each of the labels onto the svg
    this.labels.forEach((label, index) => {
      let point = document.createElementNS(ns, "circle");
      point.setAttribute("r", this.point_radius);

      // Calculate the x and y coords of the point
      let x = this.width / 2 + max * Math.cos(angle * index - Math.PI / 2);
      let y =
        this.height / 2 +
        max * Math.sin(angle * index - Math.PI / 2) -
        this.point_radius;

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

    for (let i = 0; i < 5; i++) {
      let dim = i * 20;
      const polygon = document.createElementNS(ns, "polygon");
      polygon.setAttribute("fill", "none");
      polygon.setAttribute("stroke", "black");
      polygon.setAttribute("stroke-width", 1);
      polygon.setAttribute("opacity", 0.6);
      let points = "";

      for (let i = 0; i < this.labels.length; i++) {
        let x = this.width / 2 + dim * Math.cos(angle * i - Math.PI / 2);
        let y = this.width / 2 + dim * Math.sin(angle * i - Math.PI / 2);

        points += `${x},${y} `;
      }

      polygon.setAttribute("points", points);
      grouping.appendChild(polygon);
    }

    return grouping;
  }

  // Render the polygon onto the graph for the data points
  polygon(data) {
    console.log("Data", data);
    let polygon = document.createElementNS(ns, "polygon");
    polygon.setAttribute("fill", "none");
    polygon.setAttribute("stroke", "black");
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
