document.getElementById("visul1").addEventListener("click", runUserCode);
document.getElementById("visul2").addEventListener("click", visualizeExecution);
document.getElementById("prevBtn").addEventListener("click", prevStep);
document.getElementById("nextBtn").addEventListener("click", nextStep);

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
        console.error("Invalid code:", error);
        alert("Error: Invalid input. Please define an array as 'let arr = [..];'");
    }
    return null;
}

function runUserCode() {
    let code = document.getElementById("enter_code").value;
    let newArray = extractArrayFromCode(code);
    if (newArray) {
        data = newArray;
        resetVisualization();
    } else {
        alert("Invalid array input. Make sure you define an array as 'let arr = [..];'");
    }
}

function resetVisualization() {
    steps = [];
    currentStep = 0;
    createBlocks(data);
    recordSteps();
    updateButtons();
}

function createBlocks(arr, highlight = [], i = 0, j = 0) {
    const container = document.querySelector(".visualization");
    container.innerHTML = "";
    arr.forEach((value, index) => {
        const block = document.createElement("div");
        block.classList.add("block");
        block.textContent = value;
        if (highlight.includes(index)) {
            block.classList.add("highlight");
        }
        container.appendChild(block);
    });
}




function recordSteps() {
    let tempArr = [...data];
    let n = tempArr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            steps.push({ array: [...tempArr], highlight: [j, j + 1], swap: false, i, j });
            if (tempArr[j] > tempArr[j + 1]) {
                [tempArr[j], tempArr[j + 1]] = [tempArr[j + 1], tempArr[j]];
                steps.push({ array: [...tempArr], highlight: [j, j + 1], swap: true, i, j });
            }
        }
    }
}

function nextStep() {
    if (currentStep < steps.length) {
        let step = steps[currentStep];
        if (step.swap) {
            animateSwap(step.array, step.highlight);
        } else {
            createBlocks(step.array, step.highlight, step.i, step.j);
        }
        currentStep++;
    }
    updateButtons();
}

function animateSwap(arr, indices) {
    const blocks = document.querySelectorAll(".block");
    let [idx1, idx2] = indices;
    let block1 = blocks[idx1];
    let block2 = blocks[idx2];

    block1.style.transition = "transform 0.8s ease-in-out";
    block2.style.transition = "transform 0.8s ease-in-out";
    
    block1.style.transform = "translate(30px, -30px) rotate(360deg)";
    block2.style.transform = "translate(-30px, 30px) rotate(-360deg)";

    setTimeout(() => {
        block1.style.transform = "translate(0,0)";
        block2.style.transform = "translate(0,0)";
        createBlocks(arr, indices);
    }, 800);
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

function visualizeExecution() {
    currentStep = 0;
    function stepExecution() {
        if (currentStep < steps.length) {
            nextStep();
            setTimeout(stepExecution, 1000);
        }
    }
    stepExecution();
}
