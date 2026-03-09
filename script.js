let array = [];
let sorting = false;

const container = document.getElementById("array-container");
const stepText  = document.getElementById("step-text");

function getDelay() {
    const raw = parseInt(document.getElementById("speed").value);
    return 3000 - raw;
}

function generateArray() {
    if (sorting) return;
    container.innerHTML = "";
    array = [];
    stepText.innerText = "New array generated let's go! ";

    
    hideHeapTree();

    for (let i = 0; i < 10; i++) {
        let value = Math.floor(Math.random() * 100) + 20;
        array.push(value);
        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = value + "px";
        bar.innerText = value;
        bar.style.animationDelay = (i * 50) + "ms";
        bar.classList.add("pop-in");
        container.appendChild(bar);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSorting() {
    if (sorting) return;
    if (array.length === 0) { generateArray(); await sleep(600); }
    const algo = document.getElementById("algorithm").value;
    sorting = true;
    document.getElementById("btn-sort").disabled = true;
    document.getElementById("btn-generate").disabled = true;

    if      (algo === "bubble")    await bubbleSort();
    else if (algo === "insertion") await insertionSort();
    else if (algo === "selection") await selectionSort();
    else if (algo === "merge")     await mergeSort();
    else if (algo === "quick")     await quickSort();
    else                           await heapSort();

    sorting = false;
    document.getElementById("btn-sort").disabled = false;
    document.getElementById("btn-generate").disabled = false;
    launchStars();
}

async function bubbleSort() {
    let bars = document.getElementsByClassName("bar");
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            stepText.innerText = `🔍 Comparing ${array[j]} and ${array[j+1]}`;
            bars[j].classList.add("comparing");
            bars[j+1].classList.add("comparing");
            await sleep(getDelay());

            if (array[j] > array[j+1]) {
                stepText.innerText = `🔄 Swapping ${array[j]} ↔ ${array[j+1]}`;
                await sleep(getDelay() * 0.6);
                let temp = array[j]; array[j] = array[j+1]; array[j+1] = temp;
                bars[j].style.height   = array[j]   + "px"; bars[j].innerText   = array[j];
                bars[j+1].style.height = array[j+1] + "px"; bars[j+1].innerText = array[j+1];
            }
            bars[j].classList.remove("comparing");
            bars[j+1].classList.remove("comparing");
        }
        bars[array.length - i - 1].classList.add("sorted");
    }
    stepText.innerText = "Bubble Sort complete! lessss goooo!";
    await markAllDone(bars);
}

async function insertionSort() {
    let bars = document.getElementsByClassName("bar");
    bars[0].classList.add("sorted");
    for (let i = 1; i < array.length; i++) {
        let key = array[i], j = i - 1;
        stepText.innerText = `📌 Key element: ${key}`;
        bars[i].classList.add("key-elem");
        await sleep(getDelay());
        while (j >= 0 && array[j] > key) {
            stepText.innerText = `↪️ Shifting ${array[j]} right`;
            bars[j].classList.add("comparing"); bars[j+1].classList.add("comparing");
            await sleep(getDelay());
            array[j+1] = array[j];
            bars[j+1].style.height = array[j+1] + "px"; bars[j+1].innerText = array[j+1];
            bars[j].classList.remove("comparing"); bars[j+1].classList.remove("comparing");
            bars[j+1].classList.remove("sorted");
            j--;
        }
        array[j+1] = key;
        bars[j+1].style.height = key + "px"; bars[j+1].innerText = key;
        bars[j+1].classList.remove("key-elem"); bars[j+1].classList.add("sorted");
        await sleep(getDelay() * 0.5);
    }
    stepText.innerText = "Insertion Sort complete! comeon boy!";
    await markAllDone(bars);
}

async function selectionSort() {
    let bars = document.getElementsByClassName("bar");
    for (let i = 0; i < array.length; i++) {
        let minIdx = i;
        bars[i].classList.add("key-elem");
        for (let j = i + 1; j < array.length; j++) {
            stepText.innerText = `🔍 Comparing ${array[j]} with current min ${array[minIdx]}`;
            bars[j].classList.add("comparing");
            if (minIdx !== i) bars[minIdx].classList.add("comparing");
            await sleep(getDelay());
            if (array[j] < array[minIdx]) {
                if (minIdx !== i) bars[minIdx].classList.remove("comparing");
                minIdx = j;
            } else { bars[j].classList.remove("comparing"); }
        }
        if (minIdx !== i) {
            stepText.innerText = `🔄 Swapping ${array[i]} ↔ ${array[minIdx]}`;
            bars[minIdx].classList.remove("comparing");
            let temp = array[i]; array[i] = array[minIdx]; array[minIdx] = temp;
            bars[i].style.height      = array[i]      + "px"; bars[i].innerText      = array[i];
            bars[minIdx].style.height = array[minIdx] + "px"; bars[minIdx].innerText = array[minIdx];
            await sleep(getDelay() * 0.6);
        }
        bars[i].classList.remove("key-elem"); bars[i].classList.add("sorted");
    }
    stepText.innerText = "Selection Sort complete! nailed it! 🎯";
    await markAllDone(bars);
}

async function mergeSort() {
    let bars = document.getElementsByClassName("bar");
    for (let b of bars) { b.style.marginLeft = "4px"; b.style.outline = "none"; b.style.background = ""; }
    stepText.innerText = "🏗️ Starting Merge Sort — dividing array...";
    await sleep(getDelay());
    await mergeSortHelper(0, array.length - 1, bars);
    for (let b of bars) { b.style.marginLeft = "4px"; b.style.outline = "none"; b.style.background = ""; }
    stepText.innerText = "Merge Sort complete! smooth operator 😎";
    await markAllDone(bars);
}

async function mergeSortHelper(left, right, bars) {
    if (left >= right) {
        bars[left].style.outline = "3px dashed #4caf50"; bars[left].style.outlineOffset = "3px";
        await sleep(getDelay() * 0.4);
        bars[left].style.outline = "none";
        return;
    }
    let mid = Math.floor((left + right) / 2);
    await highlightChunk(left, right, bars, "#ab47bc");
    stepText.innerText = `✂️ Dividing [${left} → ${right}] at midpoint ${mid}`;
    await sleep(getDelay() * 0.8);
    await clearChunkHighlight(left, right, bars);
    bars[mid + 1].style.marginLeft = "22px";
    stepText.innerText = `↔️ Split → Left: [${left}..${mid}]  |  Right: [${mid+1}..${right}]`;
    await sleep(getDelay() * 0.7);
    await mergeSortHelper(left, mid, bars);
    await mergeSortHelper(mid + 1, right, bars);
    await merge(left, mid, right, bars);
    bars[mid + 1].style.marginLeft = "4px";
}

async function merge(left, mid, right, bars) {
    for (let x = left; x <= mid; x++)      { bars[x].style.background = "var(--orange)"; bars[x].classList.remove("sorted","comparing","key-elem"); }
    for (let x = mid+1; x <= right; x++)   { bars[x].style.background = "var(--sky)";    bars[x].classList.remove("sorted","comparing","key-elem"); }
    stepText.innerText = `🔀 Merging — 🟠 Left [${left}..${mid}]  +  🔵 Right [${mid+1}..${right}]`;
    await sleep(getDelay());
    let leftArr = array.slice(left, mid+1), rightArr = array.slice(mid+1, right+1);
    let i = 0, j = 0, k = left;
    while (i < leftArr.length && j < rightArr.length) {
        stepText.innerText = `🔍 Comparing 🟠 ${leftArr[i]}  vs  🔵 ${rightArr[j]}`;
        bars[k].classList.add("comparing"); await sleep(getDelay());
        array[k] = leftArr[i] <= rightArr[j] ? leftArr[i++] : rightArr[j++];
        bars[k].style.height = array[k]+"px"; bars[k].innerText = array[k];
        bars[k].style.background = ""; bars[k].classList.remove("comparing"); bars[k].classList.add("sorted"); k++;
    }
    while (i < leftArr.length) {
        bars[k].classList.add("comparing"); await sleep(getDelay() * 0.45);
        array[k] = leftArr[i++]; bars[k].style.height = array[k]+"px"; bars[k].innerText = array[k];
        bars[k].style.background = ""; bars[k].classList.remove("comparing"); bars[k].classList.add("sorted"); k++;
    }
    while (j < rightArr.length) {
        bars[k].classList.add("comparing"); await sleep(getDelay() * 0.45);
        array[k] = rightArr[j++]; bars[k].style.height = array[k]+"px"; bars[k].innerText = array[k];
        bars[k].style.background = ""; bars[k].classList.remove("comparing"); bars[k].classList.add("sorted"); k++;
    }
}

async function highlightChunk(left, right, bars, color) {
    for (let x = left; x <= right; x++) { bars[x].style.outline = `3px dashed ${color}`; bars[x].style.outlineOffset = "3px"; }
}
async function clearChunkHighlight(left, right, bars) {
    for (let x = left; x <= right; x++) bars[x].style.outline = "none";
}


async function quickSort() {
    let bars = document.getElementsByClassName("bar");
    for (let b of bars) { b.style.marginLeft = "4px"; b.style.outline = "none"; b.style.background = ""; }
    stepText.innerText = "⚡ Starting Quick Sort — picking pivots...";
    await sleep(getDelay());
    await quickSortHelper(0, array.length - 1, bars);
    for (let b of bars) { b.style.marginLeft = "4px"; b.style.outline = "none"; b.style.background = ""; }
    stepText.innerText = "Quick Sort complete! speedy gonzales 🚀";
    await markAllDone(bars);
}

async function quickSortHelper(low, high, bars) {
    if (low >= high) {
        if (low === high) {
            bars[low].style.outline = "3px dashed #4caf50"; bars[low].style.outlineOffset = "3px";
            await sleep(getDelay() * 0.4);
            bars[low].style.outline = "none"; bars[low].classList.add("sorted");
        }
        return;
    }
    for (let x = low; x <= high; x++) { bars[x].style.outline = "3px dashed #ab47bc"; bars[x].style.outlineOffset = "3px"; }
    stepText.innerText = `🔎 Active partition: [${low} → ${high}]`;
    await sleep(getDelay() * 0.7);
    let pivotIdx = await partition(low, high, bars);
    bars[pivotIdx].style.outline = "none"; bars[pivotIdx].classList.add("sorted"); bars[pivotIdx].style.background = "";
    stepText.innerText = `✅ Pivot ${array[pivotIdx]} placed at index ${pivotIdx}`;
    for (let x = low; x < pivotIdx; x++)       { bars[x].style.outline = "3px dashed var(--orange)"; bars[x].style.outlineOffset = "3px"; bars[x].style.background = "rgba(255,152,0,0.35)"; }
    for (let x = pivotIdx+1; x <= high; x++)   { bars[x].style.outline = "3px dashed var(--sky)";    bars[x].style.outlineOffset = "3px"; bars[x].style.background = "rgba(41,182,246,0.35)"; }
    if (pivotIdx > low)  bars[pivotIdx].style.marginLeft     = "18px";
    if (pivotIdx < high) bars[pivotIdx+1].style.marginLeft   = "18px";
    await sleep(getDelay() * 1.1);
    for (let x = low; x <= high; x++) { bars[x].style.outline = "none"; if (!bars[x].classList.contains("sorted")) bars[x].style.background = ""; }
    await quickSortHelper(low, pivotIdx - 1, bars);
    await quickSortHelper(pivotIdx + 1, high, bars);
    if (pivotIdx > low)  bars[pivotIdx].style.marginLeft     = "4px";
    if (pivotIdx < high) bars[pivotIdx+1].style.marginLeft   = "4px";
}

async function partition(low, high, bars) {
    let pivot = array[high];
    bars[high].classList.add("key-elem"); bars[high].style.outline = "3px solid #ff9800"; bars[high].style.outlineOffset = "4px";
    stepText.innerText = `📌 Pivot: ${pivot} (index ${high})`;
    await sleep(getDelay());
    let i = low - 1;
    for (let j = low; j < high; j++) {
        stepText.innerText = `🔍 Is ${array[j]} ≤ pivot ${pivot}?`;
        bars[j].classList.add("comparing"); bars[j].style.outline = "2px dashed #f44336"; bars[j].style.outlineOffset = "3px";
        await sleep(getDelay());
        if (array[j] <= pivot) {
            i++; stepText.innerText = `✅ Yes! Swapping ${array[i]} ↔ ${array[j]}`;
            bars[i].classList.add("comparing"); await sleep(getDelay() * 0.3);
            let temp = array[i]; array[i] = array[j]; array[j] = temp;
            bars[i].style.height = array[i]+"px"; bars[i].innerText = array[i];
            bars[j].style.height = array[j]+"px"; bars[j].innerText = array[j];
            await sleep(getDelay() * 0.4); bars[i].classList.remove("comparing");
        } else { stepText.innerText = `❌ No, ${array[j]} > ${pivot} — skip`; await sleep(getDelay() * 0.3); }
        bars[j].classList.remove("comparing"); bars[j].style.outline = "none";
    }
    stepText.innerText = `🎯 Placing pivot ${pivot} at index ${i+1}`;
    bars[high].style.outline = "none";
    let temp = array[i+1]; array[i+1] = array[high]; array[high] = temp;
    bars[i+1].style.height = array[i+1]+"px"; bars[i+1].innerText = array[i+1];
    bars[high].style.height = array[high]+"px"; bars[high].innerText = array[high];
    bars[high].classList.remove("key-elem"); bars[high].style.background = "";
    await sleep(getDelay() * 0.6);
    return i + 1;
}



const TREE_W    = 660;
const TREE_H    = 280;
const NODE_R    = 24;
const LEVEL_GAP = 72;


const COL = {
    default  : { fill: "#29b6f6", stroke: "#2a2a2a", text: "#2a2a2a" },  
    comparing: { fill: "#f44336", stroke: "#2a2a2a", text: "#fff"    },   
    key      : { fill: "#ff9800", stroke: "#2a2a2a", text: "#2a2a2a" },   
    sorted   : { fill: "#4caf50", stroke: "#2a2a2a", text: "#fff"    },   
    done     : { fill: "#8bc34a", stroke: "#2a2a2a", text: "#2a2a2a" },   
};


let heapSortedSet = new Set();


function showHeapTree() {
    
    document.getElementById("arena").style.display = "none";

    
    if (!document.getElementById("heap-arena")) {
        const panel = document.createElement("div");
        panel.id = "heap-arena";
        panel.style.cssText = `
            position:relative; z-index:1;
            background:var(--white);
            border:3px solid var(--ink);
            border-radius:20px;
            box-shadow:6px 6px 0 var(--ink);
            padding:18px 12px 12px;
            width:min(700px,95vw);
            margin-bottom:0;
        `;

        
        const label = document.createElement("div");
        label.style.cssText = `
            font-family:'Fredoka One',cursive;
            font-size:0.95rem;
            color:#888;
            text-align:center;
            margin-bottom:6px;
            letter-spacing:1px;
        `;
        label.innerText = "🎄 Binary Max-Heap Tree";
        panel.appendChild(label);

        
        const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.id = "heap-svg";
        svg.setAttribute("viewBox", `0 0 ${TREE_W} ${TREE_H}`);
        svg.style.cssText = `width:100%;height:auto;display:block;overflow:visible;`;
        panel.appendChild(svg);

        
        const arena = document.getElementById("arena");
        arena.parentNode.insertBefore(panel, arena.nextSibling);
    }

    document.getElementById("heap-arena").style.display = "block";
}

function hideHeapTree() {
    const panel = document.getElementById("heap-arena");
    if (panel) panel.style.display = "none";
    document.getElementById("arena").style.display = "block";
}


function nodePos(i) {
    const level  = Math.floor(Math.log2(i + 1));          
    const posInLevel = i - (Math.pow(2, level) - 1);      
    const nodesInLevel = Math.pow(2, level);
    const x = TREE_W * (posInLevel + 0.5) / nodesInLevel;
    const y = 30 + level * LEVEL_GAP;
    return { x, y };
}


function renderTree(heapSize, highlights = {}) {
   
    const svg = document.getElementById("heap-svg");
    if (!svg) return;
    svg.innerHTML = "";

    const n = heapSize;

    
    for (let i = 0; i < n; i++) {
        const left  = 2 * i + 1;
        const right = 2 * i + 2;
        const p = nodePos(i);

        [left, right].forEach(child => {
            if (child < n) {
                const c = nodePos(child);
                const line = document.createElementNS("http://www.w3.org/2000/svg","line");
                line.setAttribute("x1", p.x); line.setAttribute("y1", p.y);
                line.setAttribute("x2", c.x); line.setAttribute("y2", c.y);
                line.setAttribute("stroke", "#2a2a2a");
                line.setAttribute("stroke-width", "2.5");
                line.setAttribute("stroke-linecap","round");
                svg.appendChild(line);
            }
        });
    }

    for (let i = 0; i < array.length; i++) {
        const { x, y } = nodePos(i);

        let state = "default";
        if (heapSortedSet.has(i))         state = "sorted";
        if (highlights[i])                state = highlights[i];

        const col = COL[state];

        const shadow = document.createElementNS("http://www.w3.org/2000/svg","circle");
        shadow.setAttribute("cx", x + 3); shadow.setAttribute("cy", y + 3);
        shadow.setAttribute("r", NODE_R);
        shadow.setAttribute("fill", "rgba(0,0,0,0.18)");
        svg.appendChild(shadow);

       
        const circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
        circle.setAttribute("cx", x); circle.setAttribute("cy", y);
        circle.setAttribute("r", NODE_R);
        circle.setAttribute("fill", col.fill);
        circle.setAttribute("stroke", col.stroke);
        circle.setAttribute("stroke-width", "2.5");

        
        if (state === "comparing" || state === "key") {
            circle.style.cssText = "animation: heapPulse 0.4s ease infinite alternate;";
        }

        svg.appendChild(circle);

        
        const idxLabel = document.createElementNS("http://www.w3.org/2000/svg","text");
        idxLabel.setAttribute("x", x - NODE_R + 5);
        idxLabel.setAttribute("y", y - NODE_R + 13);
        idxLabel.setAttribute("font-size", "9");
        idxLabel.setAttribute("fill", "#888");
        idxLabel.setAttribute("font-family", "Patrick Hand, cursive");
        idxLabel.textContent = `[${i}]`;
        svg.appendChild(idxLabel);

        
        const text = document.createElementNS("http://www.w3.org/2000/svg","text");
        text.setAttribute("x", x); text.setAttribute("y", y + 6);
        text.setAttribute("text-anchor","middle");
        text.setAttribute("dominant-baseline","middle");
        text.setAttribute("font-size", "14");
        text.setAttribute("font-weight","bold");
        text.setAttribute("font-family","Fredoka One, cursive");
        text.setAttribute("fill", col.text);
        text.textContent = i < heapSize ? array[i] : "";  
        svg.appendChild(text);

        
        if (i >= heapSize) {
            const overlay = document.createElementNS("http://www.w3.org/2000/svg","circle");
            overlay.setAttribute("cx", x); overlay.setAttribute("cy", y);
            overlay.setAttribute("r", NODE_R);
            overlay.setAttribute("fill", "rgba(255,255,255,0.55)");
            svg.appendChild(overlay);

            const doneText = document.createElementNS("http://www.w3.org/2000/svg","text");
            doneText.setAttribute("x", x); doneText.setAttribute("y", y + 6);
            doneText.setAttribute("text-anchor","middle");
            doneText.setAttribute("font-size","13");
            doneText.setAttribute("font-family","Fredoka One, cursive");
            doneText.setAttribute("fill","#4caf50");
            doneText.setAttribute("font-weight","bold");
            doneText.textContent = array[i];
            svg.appendChild(doneText);
        }
    }

    
    if (!document.getElementById("heap-pulse-style")) {
        const style = document.createElement("style");
        style.id = "heap-pulse-style";
        style.textContent = `
            @keyframes heapPulse {
                from { r: ${NODE_R}; }
                to   { r: ${NODE_R + 4}; }
            }
        `;
        document.head.appendChild(style);
    }
}


async function heapSort() {
    heapSortedSet.clear();
    showHeapTree();

    let n = array.length;

    
    stepText.innerText = "🏗️ Building max heap from bottom up...";
    renderTree(n);
    await sleep(getDelay() * 0.8);

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    stepText.innerText = "✅ Max heap built! Root is the largest element.";
    renderTree(n, { 0: "key" });
    await sleep(getDelay());

    
    for (let i = n - 1; i > 0; i--) {
        stepText.innerText = `🔄 Swapping root ${array[0]} ↔ last heap node ${array[i]}`;
        renderTree(i + 1, { 0: "comparing", [i]: "comparing" });
        await sleep(getDelay());

    
        let temp  = array[0]; array[0] = array[i]; array[i] = temp;
        heapSortedSet.add(i);

        renderTree(i, { 0: "key" });
        stepText.innerText = `✅ ${array[i]} placed in sorted position [${i}]`;
        await sleep(getDelay() * 0.6);

        
        await heapify(i, 0);
    }

    heapSortedSet.add(0);
    renderTree(0);
    stepText.innerText = "Heap Sort complete! heap heap hurrayyyy!!!🥳";

    
    for (let k = 0; k < array.length; k++) {
        heapSortedSet.add(k);
        renderTree(0, Object.fromEntries([...Array(k+1).keys()].map(x => [x,"done"])));
        await sleep(80);
    }

    
    await sleep(600);
    hideHeapTree();
    _rebuildBarsFromArray();
    let bars = document.getElementsByClassName("bar");
    await markAllDone(bars);
}

async function heapify(heapSize, i) {
    let largest = i;
    let left    = 2 * i + 1;
    let right   = 2 * i + 2;

    if (left  < heapSize && array[left]  > array[largest]) largest = left;
    if (right < heapSize && array[right] > array[largest]) largest = right;

    if (largest !== i) {
        stepText.innerText = `🔺 Heapify: ${array[i]} < child ${array[largest]} — swapping`;

        
        renderTree(heapSize, { [i]: "key", [largest]: "comparing" });
        await sleep(getDelay() * 0.75);

        let temp = array[i]; array[i] = array[largest]; array[largest] = temp;

        renderTree(heapSize, { [i]: "comparing", [largest]: "key" });
        await sleep(getDelay() * 0.4);

        await heapify(heapSize, largest);
    } else {
        
        renderTree(heapSize, { [i]: "sorted" });
        await sleep(getDelay() * 0.25);
        renderTree(heapSize);
    }
}


function _rebuildBarsFromArray() {
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = array[i] + "px";
        bar.innerText = array[i];
        container.appendChild(bar);
    }
}



async function markAllDone(bars) {
    for (let k = 0; k < bars.length; k++) {
        bars[k].classList.remove("sorted");
        bars[k].classList.add("done");
        await sleep(60);
    }
}

function launchStars() {
    const emojis = ["⭐","🌟","✨","💫","🎉","🎊"];
    for (let s = 0; s < 12; s++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        star.style.left = Math.random() * 100 + "vw";
        star.style.top  = Math.random() * 100 + "vh";
        star.style.setProperty("--tx", (Math.random() * 200 - 100) + "px");
        star.style.setProperty("--ty", (Math.random() * 200 - 100) + "px");
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1000);
    }
}

function showdescription() {
    const choice = document.getElementById("algorithm").value;
    const desc   = document.getElementById("description");
    const descriptions = {
        bubble:    "Bubble Sort repeatedly compares adjacent elements and swaps them if they're in the wrong order. After each pass, the largest unsorted element bubbles to its correct position. Simple but slow — O(n²) time complexity.",
        insertion: "Insertion Sort builds a sorted portion one element at a time. It picks each new element and inserts it into its correct position among the already-sorted elements. Great for small or nearly-sorted datasets — O(n²) worst case, O(n) best case.",
        selection: "Selection Sort scans the unsorted portion to find the minimum element, then swaps it to the front. Repeats until the array is sorted. Always O(n²) comparisons regardless of input — simple but inefficient for large arrays.",
        merge:     "Merge Sort divides the array in half recursively until single elements remain, then merges them back in sorted order. It's a stable, divide-and-conquer algorithm with guaranteed O(n log n) time complexity — great for large datasets.",
        quick:     "Quick Sort picks a pivot element and partitions the array so smaller elements go left and larger go right. Recursively sorts each partition. Average O(n log n) time — one of the fastest sorting algorithms in practice.",
        heap:      "Heap Sort first builds a max-heap (a binary tree where every parent ≥ its children), then repeatedly extracts the root (max element) and places it at the end. The tree updates live as each heapify step runs. O(n log n) time, in-place."
    };
    desc.innerText = descriptions[choice] || "";
}


generateArray();
showdescription();