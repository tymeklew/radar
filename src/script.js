const graphElement = document.querySelector("#graph");
const tableEleent = document.querySelector("#data-table");

var creator = new Creator(800, 800);
creator.setTargetElement(graphElement);

var state = {
  labels: ["English", "Physics", "Biology", "Chemistry"],
  variants: [[1, 2, 3, 4]],
};

function renderVariants() {
  state.variants.forEach((data, var_index) => {
    const parent = document.createElement("tr");
    const name = document.createElement("td");

    name.textContent = "Variant";
    parent.appendChild(name);

    data.forEach((value, data_index) => {
      const child = document.createElement("td");
      const input = document.createElement("input");

      input.type = "number";
      input.onchange = (ev) => {
        creator.data[var_index][data_index] = parseInt(ev.target.value);
        creator.updateMaxDataValue();
        updateGraph();
      };
      input.value = value;

      child.appendChild(input);
      parent.appendChild(child);
    });
    tableEleent.appendChild(parent);
  });
}

function updateGraph() {
  creator.labels = state.labels;
  creator.data = state.variants;
  creator.updateMaxDataValue();
  creator.render();
}

window.onload = () => {
  console.log("Hello World");
  console.log(creator);
  renderVariants();
  updateGraph();
};
