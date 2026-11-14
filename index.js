const btn1 = document.getElementById("btn-1");
const btn2 = document.getElementById("btn-2");
const btn3 = document.getElementById("btn-3");
const btn4 = document.getElementById("btn-4");
const btnN = document.getElementById("btn-Next");
const btnR = document.getElementById("btn-Reroll");

const castle1 = document.getElementById("castle-1");
const castle2 = document.getElementById("castle-2");
const castle3 = document.getElementById("castle-3");
const castle4 = document.getElementById("castle-4");

let currentCastle = 1;

let rerrollTokens = 0;

btnN.disabled = true;
btnR.disabled = true;

btn1.onclick = () => clickBtn(btn1);
btn2.onclick = () => clickBtn(btn2);
btn3.onclick = () => clickBtn(btn3);
btn4.onclick = () => clickBtn(btn4);
btnN.onclick = () => clickBtn(btnN);
btnR.onclick = () => clickBtn(btnR);

function clickBtn(n) {
    if (n === btnR) {
        rerrollTokens -= 1;
        n.innerText = `Reroll (tokens: ${rerrollTokens})`;
        // rerroll options
        if (rerrollTokens <= 0) {n.disabled = true;}
        return;
    }
    n.disabled = true;
    if (n === btnN) {
        btn1.disabled = false;
        btn2.disabled = false;
        btn3.disabled = false;
        btn4.disabled = false;
        currentCastle = 1;
        setActive(castle1);
        return;
    }
    currentCastle += 1
    if (currentCastle === 5) {
        btnN.disabled = false;
    }
    setActive([castle1,castle2,castle3,castle4,null][currentCastle - 1]);
}

function setActive(n) {
    for (const c of [castle1,castle2,castle3,castle4]) {
        c.classList.remove("selected")
    }
    if (n === null) {return;}
    n.classList.toggle("selected")
}