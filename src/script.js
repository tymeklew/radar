import Creator from "./creator.js";

const graphElement = document.querySelector("#graph");

var creator = new Creator(800, 800);
creator.setTargetElement(graphElement);

window.onload = () => {
  console.log("Real");

  creator.labels = ["English", "Physics", "Biology", "Chemistry", "Geology"];
  creator.data = [[1, 2, 3, 4, 5]];

  creator.render();
};
