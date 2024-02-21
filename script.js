const freqs = {};
const setFreqs = {
  Size: 0,
};
let cols = 0;
let rows = 0;
let globalAttributes = [];
let globalClasses = [];
let globalEntropy = 0;

const createTable = () => {
  cols = prompt("Ingrese el número de clases");
  rows = prompt("Ingrese el número de atributos");

  // classes
  const headers = [];
  for (let i = 0; i < cols; i++) {
    headers.push(prompt(`Ingrese nombre de la clase ${i + 1}`));
  }
  // attriutes
  const attributes = [];
  for (let i = 0; i < rows; i++) {
    attributes.push(prompt(`Ingrese nombre del atributo ${i + 1}`));
  }
  globalAttributes = [...attributes];
  globalClasses = [...headers];

  // Fill the object that will represent the table
  attributes.forEach((attribute) => {
    let tmp = {};
    headers.forEach((header) => {
      tmp[header] = 0;
    });
    tmp["Total"] = 0;
    freqs[attribute] = tmp;
  });
  drawTable(rows, cols, headers, attributes);
};

const drawTable = (rows, cols, headers, attributes) => {
  let table = "<table>";
  const tblContainer = document.getElementById("table");
  headers.unshift("Clases");
  table += "<tr>";

  headers.forEach((header) => {
    console.log(header);
    table += `<th>${header}</th>`;
  });

  table += "</tr>";

  let w = 0;
  for (let i = 0; i < rows; i++) {
    table += "<tr>";
    for (let j = 0; j < cols; j++) {
      if (j > 0) {
        table += `<td><input type="text" id="${i}, ${j}"></td>`;
      } else {
        table += `<td>${attributes[w]}</td>`;
        table += `<td><input type="text" id="${i}, ${j}"></td>`;
      }
    }
    w++;
    table += "</tr>";
  }
  table += "</table>";
  tblContainer.innerHTML = table;
};

const fillFreqs = () => {
  let totalInstances = 0;
  for (let i = 0; i < rows; i++) {
    let total = 0;
    for (let j = 0; j < cols; j++) {
      const inpValue = document.getElementById(`${i}, ${j}`).value;
      freqs[globalAttributes[i]][globalClasses[j]] = Number(inpValue);
      total += Number(inpValue);
    }
    freqs[globalAttributes[i]]["Total"] = total;
    totalInstances += total;
  }
  freqs["Total"] = totalInstances;
  console.log(freqs);
};

const calcularEntropia = () => {
  fillFreqs();
  const entropyContainer = document.getElementById("normal-entropy");
  let totalInstances = freqs["Total"];
  let entropy = 0;

  for (const className in freqs) {
    if (className !== "Total") {
      const classData = freqs[className];
      const classInstances = classData["Total"];
      let classEntropy = 0;

      for (const outcome in classData) {
        if (outcome !== "Total") {
          const outcomeCount = classData[outcome];
          const outcomeProbability = outcomeCount / classInstances;
          const outcomeLog =
            outcomeProbability > 0 ? Math.log2(outcomeProbability) : 0;
          classEntropy -= outcomeProbability * outcomeLog;
        }
      }

      const classWeight = classInstances / totalInstances;
      entropy += classWeight * classEntropy;
    }
  }
  globalEntropy = entropy;
  entropyContainer.innerHTML += `<p><b>${entropy}</b></p>`;
};

const addSetClass = () => {
  const setEntropyContainer = document.getElementById("set-entropy");
  const className = prompt("Nombre de la clase");
  const freq = prompt("Cantidad de veces que se repite");
  setEntropyContainer.innerHTML += `<p id="${className}">${className} - ${freq}</p>`;
  setFreqs[className] = Number(freq);
  setFreqs["Size"] += Number(freq);
};

const calcSetEntropy = () => {
  let setEntropy = 0;
  let setSize = setFreqs["Size"];
  const values = Object.entries(setFreqs);
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] !== "Size") {
      const x = values[i][1] / setSize;
      const y = Math.log2(x);
      setEntropy -= x * y;
    }
  }
  const ganancia = setEntropy - globalEntropy;
  document.body.innerHTML += `<p>Entropia de conjunto: <b>${setEntropy}</b></p>`;
  document.body.innerHTML += `<p>Ganancia: <b>${ganancia}</b></p>`;
};
