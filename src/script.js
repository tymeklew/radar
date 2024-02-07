const graphElement = document.querySelector("#graph");

var creator = new Creator(800, 800);
creator.label_size = 18;
creator.setTargetElement(graphElement);

creator.addLabel("Geography");
creator.addLabel("Physics");
creator.addLabel("Physics");
creator.addLabel("Physics");
creator.addLabel("Physics");
creator.addData([5, 10, 8, 2, 4]);
