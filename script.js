document.addEventListener('DOMContentLoaded', () => {
    const addTextButton = document.getElementById('btn');
    const canvas = document.querySelector('.canvas');
    const boldButton = document.getElementById('bold');
    const italicButton = document.getElementById('italic');
    const underlineButton = document.getElementById('underline');
    const fontSelect = document.getElementById('font-family');
    const incrementButton = document.querySelector('.increment');
    const decrementButton = document.querySelector('.decrement');
    const fontSizeInput = document.getElementById('number-field');
    const undoButton = document.querySelector('.fa-undo'); 
    const redoButton = document.querySelector('.fa-rotate-right'); 
    const centerButton = document.getElementById('center'); 
    let activeTextElement = null;
    let undoStack = [];
    let redoStack = [];
    const fonts = ["Arial", "Verdana", "Courier New", "Georgia", "Times New Roman", "Roboto", "Open Sans", "Lato", "Comic Sans MS", "Tahoma", "Trebuchet MS", "Impact"];

    fonts.forEach((font) => {
        const option = document.createElement("option");
        option.value = font;
        option.textContent = font;
        option.style.fontFamily = font; // Preview font in dropdown
        fontSelect.appendChild(option);
    });

    // Font Family Select Listener
    fontSelect.addEventListener('change', () => {
        if (activeTextElement) {
            activeTextElement.style.fontFamily = fontSelect.value;
            saveToUndoStack(); // Save font change
        }
    });
    
    // Function to save canvas state to undo stack
    function saveToUndoStack() {
        undoStack.push(canvas.innerHTML);
        redoStack = []; // Clear redo stack after a new action
    }
    // Add text to canvas
    addTextButton.addEventListener("click", () => {
        const textElement = document.createElement("div");
        textElement.contentEditable = true;
        textElement.classList.add("text-element");
        textElement.textContent = "Type here...";
        textElement.style.position = "absolute";
        textElement.style.top = "50px";
        textElement.style.left = "50px";
        textElement.style.fontSize = `${fontSizeInput.value}px`;
        canvas.appendChild(textElement);

        activeTextElement = textElement;
        saveToUndoStack(); // Save action
        enableDragging(textElement);
        trackContentChanges(textElement);
        textElement.focus();
    });

    // Enable dragging functionality for elements
    function enableDragging(element) {
        let offsetX = 0, offsetY = 0, isDragging = false;

        element.addEventListener("mousedown", (e) => {
            isDragging = true;
            activeTextElement = element;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging && activeTextElement === element) {
                const canvasRect = canvas.getBoundingClientRect();
                const x = e.clientX - canvasRect.left - offsetX;
                const y = e.clientY - canvasRect.top - offsetY;

                element.style.left = `${Math.max(0, Math.min(x, canvasRect.width - element.offsetWidth))}px`;
                element.style.top = `${Math.max(0, Math.min(y, canvasRect.height - element.offsetHeight))}px`;
            }
        });

        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = "move";
                saveToUndoStack(); // Save the new position
            }
        });
    }


    // Undo functionality
    undoButton.addEventListener('click', () => {
        if (undoStack.length > 0) {
            redoStack.push(canvas.innerHTML); // Move current state to redo stack
            canvas.innerHTML= undoStack.pop(); // Revert to last state
            reinitializeCanvas(); // Reinitialize event listeners on restored elements
        }
    });

    // Redo functionality
    redoButton.addEventListener('click', () => {
        if (redoStack.length > 0) {
            undoStack.push(canvas.innerHTML); // Move current state to redo stack
            canvas.innerHTML= redoStack.pop(); // Apply the redo state
            reinitializeCanvas(); // Reinitialize event listeners on restored elements
        }
    });

    
    // Track content changes in text elements
    function trackContentChanges(element) {
        element.addEventListener("input", () => {
            saveToUndoStack(); // Save every input change
        });
    }

    // Reinitialize canvas elements after undo/redo
    function reinitializeCanvas() {
        const textElements = canvas.querySelectorAll('.text-element');
        textElements.forEach((element) => {
            enableDragging(element);
            trackContentChanges(element);
        });
    }

    // Center text on canvas
    centerButton.addEventListener('click', () => {
        if (activeTextElement) {
            const canvasRect = canvas.getBoundingClientRect();
            const elementRect = activeTextElement.getBoundingClientRect();
            const centerX = (canvasRect.width - elementRect.width) / 2;
            const centerY = (canvasRect.height - elementRect.height) / 2;

            activeTextElement.style.left = `${centerX}px`;
            activeTextElement.style.top = `${centerY}px`;
            saveToUndoStack(); // Save position change
        }
    });

    // Bold Button
    boldButton.addEventListener('click', () => {
        if (activeTextElement) {
            activeTextElement.style.fontWeight = activeTextElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
            saveToUndoStack(); // Save style change
        }
    });

    // Italic Button
    italicButton.addEventListener('click', () => {
        if (activeTextElement) {
            activeTextElement.style.fontStyle = activeTextElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
            saveToUndoStack(); // Save style change
        }
    });

    // Underline Button
    underlineButton.addEventListener('click', () => {
        if (activeTextElement) {
            activeTextElement.style.textDecoration = activeTextElement.style.textDecoration === 'underline' ? 'none' : 'underline';
            saveToUndoStack(); // Save style change
        }
    });

    // Increment Font Size
    incrementButton.addEventListener('click', () => {
        if (activeTextElement) {
            let currentSize = parseInt(fontSizeInput.value, 10);
            currentSize += 1;
            fontSizeInput.value = currentSize;
            activeTextElement.style.fontSize = `${currentSize}px`;
            saveToUndoStack(); // Save font size change
        }
    });

    // Decrement Font Size
    decrementButton.addEventListener('click', () => {
        if (activeTextElement) {
            let currentSize = parseInt(fontSizeInput.value, 10);
            currentSize = Math.max(currentSize - 1, 1); // Ensure font size doesn't go below 1
            fontSizeInput.value = currentSize;
            activeTextElement.style.fontSize = `${currentSize}px`;
            saveToUndoStack(); // Save font size change
        }
    });
    window.addEventListener("resize", () => {
        const canvas = document.querySelector('.canvas');
        if (window.innerWidth < 768) {
            canvas.style.height = "200px";
        } else {
            canvas.style.height = "500px";
        }
    });
    
});
