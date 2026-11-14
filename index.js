const btn1 = document.getElementById("btn-1");
const btn2 = document.getElementById("btn-2");
const btn3 = document.getElementById("btn-3");
const btn4 = document.getElementById("btn-4");
const btnN = document.getElementById("btn-Next");
const btnR = document.getElementById("btn-Reroll");
const btnQ = document.getElementById("btn-Reset");

const castle1 = document.getElementById("castle-1");
const castle2 = document.getElementById("castle-2");
const castle3 = document.getElementById("castle-3");
const castle4 = document.getElementById("castle-4");

let stats = [castle1,castle2,castle3,castle4].map(c => ({
    castle: c, money: 100, military: 10, naval: 0, PR: 60, size: 20, tech: 3, luck: 7, hp: 100}));

const ranges = {money: [-30, 20], military: [-1, 3], naval: [-1, 2], PR: [-10, 20],size: [-1, 1], tech: [-1, 1], luck: [-3, 3], hp: [-30, 20]};
const keys = Object.keys(ranges);

const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;

function genCard() {
    // good rand pos value from ranges, and bad is rand negative value from ranges.
    const good = keys[randInt(0, keys.length - 1)];
    let bad;
    do {
        bad = keys[randInt(0, keys.length - 1)];
    } while (bad === good);

    return {[good]: randInt(1, ranges[good][1]), [bad]: randInt(ranges[bad][0], -1)};
}

function genCards() {
    [btn1,btn2,btn3,btn4].forEach(b => {
        const card = genCard()
        b.innerText = Object.entries(card)
            .map(([k, v]) => `${k}: ${v > 0 ? "+" : ""}${v}`)
            .join(", ");
        b.card = card;
    })
}
genCards();

function useCard(n) {
    const s = stats[currentCastle - 1];
    Object.entries(n.card).forEach(([k, v]) => { s[k] += v; });
    setStats();
}

let currentCastle = 1;
let rerollTokens = 0;
let currentRound = 1;

btnN.disabled = true;
btnR.disabled = true;
btnQ.disabled = true;

[btn1,btn2,btn3,btn4,btnN,btnR,btnQ].forEach(b => b.onclick = () => clickBtn(b));

function clickBtn(n) {
    if (n === btnR) {
        rerollTokens -= 1;
        n.innerText = `Reroll (tokens: ${rerollTokens})`;
        // rerroll options
        if (rerollTokens <= 0) {n.disabled = true;}
        return;
    }
    n.disabled = true;
    if (n === btnN || n === btnQ) {
        btn1.disabled = false;
        btn2.disabled = false;
        btn3.disabled = false;
        btn4.disabled = false;
        currentCastle = 1;
        currentRound = 1 + (n === btnN ? currentRound : 0);
        genCards();
        setActive(castle1);
        if (n === btnQ) {
            stats = [{castle:castle1},{castle:castle2},{castle:castle3},{castle:castle4}].map(c => ({
                castle: c, money: 100, military: 10, naval: 0, PR: 60, size: 20, tech: 3, luck: 7, hp: 100}));
            rerollTokens = 0;
        }
        return;
    }
    useCard(n);
    currentCastle += 1
    if (currentCastle === 5) {
        if (stats.some(s => s.hp <= 0)) {
            btnQ.disabled = false;
        } else {
            btnN.disabled = false;
        }
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

function setStats() {
    for (let i = 0; i<stats.length; i++) {
        stats[i].castle.innerHTML = `
        <p>money:     ${stats[i].money}</p>
        <p>millitary: ${stats[i].military}</p>
        <p>naval:     ${stats[i].naval}</p>
        <p>PR:        ${stats[i].PR}</p>
        <p>size:      ${stats[i].size}</p>
        <p>tech:      ${stats[i].tech}</p>
        <p>luck:      ${stats[i].luck}</p>
        <p>hp:        ${stats[i].hp}</p>
        `
    }
}
setStats();