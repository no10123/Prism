const btn1 = document.getElementById("btn-1");
const btn2 = document.getElementById("btn-2");
const btn3 = document.getElementById("btn-3");
const btn4 = document.getElementById("btn-4");

btn1.onclick = () => clickBtn(btn1);
btn2.onclick = () => clickBtn(btn2);
btn3.onclick = () => clickBtn(btn3);
btn4.onclick = () => clickBtn(btn4);

function clickBtn(n) {
    n.disabled = true;
}