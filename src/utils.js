// contains stuff that makes our code cleaner and nicer

export function displayDialogue(text, onDisplayEnd) {
    //onDisplayEnd a function that is gonna run when the function is done displaying
    const dialogueUI = document.getElementById("textbox-container");
    const dialogue = document.getElementById("dialogue");

    dialogueUI.style.display = "block"; // to show the dialogue on html its display:none to make it invisible by default

    // text scrolling ? understand this code // text is revealed one char at a time
    let index = 0;
    let currentText = "";
    const intervalRef = setInterval(() => {
        if (index < text.length) {
            currentText += text[index]; // appends character (? get familair with this syntax)
            dialogue.innerHTML = currentText;
            index++;
            return;
        }

        clearInterval(intervalRef);

    }, 5);

    const closeBtn = document.getElementById("close");

    function onCloseBtnClick() {
        onDisplayEnd(); // ?
        dialogueUI.style.display = "none";
        dialogue.innerHTML = "";
        clearInterval(intervalRef); // stops timer
        closeBtn.removeEventListener("click", onCloseBtnClick);
    }

    closeBtn.addEventListener("click", onCloseBtnClick);

    // try to understand this code
}

export function setCamScale(k) {
    const resizeFactor = k.width() / k.height; // canvas dimensions
    if (resizeFactor < 1) {
        k.camScale(k.vec2(1));
        return;
    }

    k.camScale(k.vec2(1.5));
}