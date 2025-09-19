document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("visul1").addEventListener("click", runUserCode);
    document.getElementById("visul2").addEventListener("click", visualizeExecution);
    document.getElementById("prevBtn").addEventListener("click", prevStep);
    document.getElementById("nextBtn").addEventListener("click", nextStep);
    document.getElementById("darkMode").addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");
    
        const darkModeBtn = document.getElementById("darkMode");
        const isDark = document.body.classList.contains("dark-theme");
    
        // Change image based on current theme
        darkModeBtn.src = isDark ? "/assests/dark_mode.png" : "/assests/light_mode.png";
    });
    
});

let data = [];
let steps = [];
let currentStep = 0;

function extractArrayFromCode(code) {
    try {
        let extractedArray = eval(`(() => { ${code}; return arr; })()`);
        if (Array.isArray(extractedArray)) {
            return extractedArray;
        }
    } catch (error) {
        alert("Error: Please define array as 'let arr = [..];'");
    }
    return null;
}

function runUserCode() {
    let code = document.getElementById("enter_code").value;
    let newArray = extractArrayFromCode(code);
    if (newArray && newArray.length > 0) {
        data = newArray;
        resetVisualization();
    } else {
        alert("Invalid or empty array. Please define 'let arr = [..];'.");
    }
}

function resetVisualization() {
    if (!data || data.length === 0) {
        alert("No data available to visualize. Please provide a valid array.");
        return;
    }
    steps = [];
    currentStep = 0;
    createBlocks(data);
    recordSteps();
    updateButtons();
}

function createBlocks(arr, highlight = [], i = 0, j = 0) {
    const container = document.querySelector(".visualization");
    container.innerHTML = "";
    if (!arr || arr.length === 0) {
        container.textContent = "No data to display.";
        return;
    }
    arr.forEach((value, index) => {
        const blockContainer = document.createElement("div");
        blockContainer.classList.add("block-container");

        // Add index above the block
        const indexLabel = document.createElement("div");
        indexLabel.classList.add("index-label");
        indexLabel.textContent = index;
        blockContainer.appendChild(indexLabel);

        // Create the block
        const block = document.createElement("div");
        block.classList.add("block");
        block.textContent = value;
        if (highlight.includes(index)) {
            block.classList.add("highlight");
        }
        blockContainer.appendChild(block);

        container.appendChild(blockContainer);
    });
}

function recordSteps() {
    const selectedAlgo = document.getElementById("algorithmSelect").value;
    steps = [];
    let tempArr = [...data];

    if (selectedAlgo === "bubble") bubbleSort(tempArr);
    else if (selectedAlgo === "selection") selectionSort(tempArr);
    else if (selectedAlgo === "insertion") insertionSort(tempArr);
    else if (selectedAlgo === "quick") quickSort(tempArr, 0, tempArr.length - 1);
    else alert("Invalid algorithm selected. Please choose a valid algorithm.");
}

function nextStep() {
    if (currentStep < steps.length) {
        let step = steps[currentStep];
        if (step.swap) {
            animateSwap(step.array, step.highlight, step.action || 'swap');
        } else {
            createBlocks(step.array, step.highlight, step.i, step.j);
        }
        currentStep++;
    }
    updateButtons();
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        let step = steps[currentStep] || { array: data, highlight: [], i: 0, j: 0 };
        createBlocks(step.array, step.highlight, step.i, step.j);
    }
    updateButtons();
}

function updateButtons() {
    document.getElementById("prevBtn").disabled = currentStep === 0;
    document.getElementById("nextBtn").disabled = currentStep >= steps.length;
}

function animateSwap(arr, indices, action = '') {
    const blocks = document.querySelectorAll(".block");

    // Ensure valid indices
    if (indices.length < 2 || !blocks[indices[0]] || !blocks[indices[1]]) {
        createBlocks(arr, indices);
        return;
    }

    const [i, j] = indices;
    const block1 = blocks[i];
    const block2 = blocks[j];

    // Get initial positions
    const rect1 = block1.getBoundingClientRect();
    const rect2 = block2.getBoundingClientRect();

    const deltaX = rect2.left - rect1.left;
    const deltaY = rect2.top - rect1.top;

    // Apply transition class
    block1.style.transition = "transform 0.5s ease";
    block2.style.transition = "transform 0.5s ease";

    block1.style.zIndex = 1;
    block2.style.zIndex = 1;

    block1.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.1) rotate(5deg)`;
    block2.style.transform = `translate(${-deltaX}px, ${-deltaY}px) scale(1.1) rotate(-5deg)`;

    setTimeout(() => {
        block1.style.transition = "none";
        block2.style.transition = "none";

        block1.style.transform = "none";  
        block2.style.transform = "none";

        // Force reflow to apply reset transform
        block1.offsetHeight;

        // Restore zIndex and transition
        block1.style.zIndex = "";
        block2.style.zIndex = "";
        block1.style.transition = "";
        block2.style.transition = "";

        createBlocks(arr, indices); // Refresh positions
    }, 500);
}


function visualizeExecution() {
    if (!steps || steps.length === 0) {
        alert("No steps recorded. Please run the code and select an algorithm first.");
        return;
    }
    currentStep = 0;
    function stepExecution() {
        if (currentStep < steps.length) {
            nextStep();
            setTimeout(stepExecution, 1000);
        }
    }
    stepExecution();
}

function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            steps.push({ array: [...arr], highlight: [j, j + 1], swap: false, i, j });
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                steps.push({ array: [...arr], highlight: [j, j + 1], swap: true, i, j });
            }
        }
    }
}

function selectionSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            steps.push({ array: [...arr], highlight: [minIdx, j], swap: false, i, j });
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            steps.push({ array: [...arr], highlight: [i, minIdx], swap: true, i, j: minIdx });
        }
    }
}

function insertionSort(arr) {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;

        steps.push({ array: [...arr], highlight: [i], swap: false, action: 'keySelect', i, j });

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            steps.push({ array: [...arr], highlight: [j, j + 1], swap: true, action: 'shift', i, j });
            j--;
        }

        arr[j + 1] = key;
        steps.push({ array: [...arr], highlight: [j + 1], swap: true, action: 'insertKey', i, j: j + 1 });
    }
}

function quickSort(arr, low, high) {
    if (low < high) {
        let pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        steps.push({ array: [...arr], highlight: [j, high], swap: false, i, j });
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push({ array: [...arr], highlight: [i, j], swap: true, i, j });
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({ array: [...arr], highlight: [i + 1, high], swap: true, i, j: high });
    return i + 1;
}

// updated
document.getElementById("outputbutton").addEventListener("click", async () => {
  const input = document.getElementById("customInput").value.trim();
  const outputEl = document.getElementById("customOutput");
  const timeEl = document.getElementById("timeComplexity");
  const spaceEl = document.getElementById("spaceComplexity");
  const resultsEl = document.getElementById("complexityResults");
  const loadingEl = document.getElementById("loadingMessage");
  const errorEl = document.getElementById("errorMessage");

  // Clear previous messages & output
  outputEl.textContent = "";
  timeEl.textContent = "";
  spaceEl.textContent = "";
  resultsEl.style.display = "none";
  errorEl.style.display = "none";

  if (!input) {
    errorEl.textContent = "Please enter the JavaScript code to analyze.";
    errorEl.style.display = "block";
    return;
  }

  loadingEl.style.display = "block";
  
  try {
    const response = await fetch("/getresult", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();

    loadingEl.style.display = "none";

    if (result.error) {
      errorEl.textContent = `Error: ${result.details || "Unknown error"}`;
      errorEl.style.display = "block";
      return;
    }

    // Show raw output (optional)
    outputEl.textContent = JSON.stringify(result, null, 2);

    // Show time & space complexity in the section
    timeEl.textContent = result.time || "N/A";
    spaceEl.textContent = result.space || "N/A";
    resultsEl.style.display = "block";

  } catch (error) {
    loadingEl.style.display = "none";
    errorEl.textContent = `Failed to fetch analysis: ${error.message}`;
    errorEl.style.display = "block";
  }
});


