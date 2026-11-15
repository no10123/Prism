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

const Challenge = {name: document.getElementById('name'), rounds: document.getElementById('rounds')};

function showTokens() {
    btnR.innerText = `Reroll (tokens: ${rerollTokens})`;
    btnR.disabled = rerollTokens <= 0;
}

let stats = [castle1,castle2,castle3,castle4].map(c => ({
    castle: c, money: 100, military: 10, naval: 0, PR: 60, size: 20, tech: 3, luck: 7, hp: 100}));

const ranges = {money: [-30, 20], military: [-1, 3], naval: [-1, 2], PR: [-10, 20],size: [-1, 1], tech: [-1, 1], luck: [-3, 3], hp: [-30, 20], rerollToken: [0,1]};
const keys = Object.keys(ranges);

const pool = {M:{money: 10, military: 2, naval: 1, PR: 5,size: 1, tech: 1, luck: 2, hp: 5},e:ranges}

const randInt = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;

function genCard() {
    // good rand pos value from ranges, and bad is rand negative value from ranges.
    const good = keys[randInt(0, keys.length - 1)];
    let bad;
    do {
        bad = keys[randInt(0, keys.length - 1)];
    } while (bad === good);

    const card = {[good]: randInt(1, ranges[good][1]), [bad]: randInt(ranges[bad][0], -1)};
    if (Math.random() < 0.15) card.rerollToken = 1;
    return card;
}

function genCardOn(b) {
    const card = genCard();
    b.innerHTML = Object.entries(card)
        .map(([k, v]) => `<span class='${k}'>${k} </span>: <span class='${v > 0 ? 'good' : 'bad'}'>${v > 0 ? "+" : ""}${v}</span>`)
        .join(", ");
    b.card = card;
}

function genCards() {
    [btn1, btn2, btn3, btn4].forEach(genCardOn);
}
genCards();

function useCard(n) {
    const s = stats[currentCastle - 1];
    for (const [k, v] of Object.entries(n.card)) {
        if (k === "rerollToken") rerollTokens += v;
        else s[k] += v;
    }
    showTokens();
    setStats();
}

function genChallenge() {
    const stat = keys[randInt(0, keys.length - 1)];
    const type = Math.random() < 0.5 ? "min" : "event";

    if (type === "min") {
        const mult = randInt(1, 3)
        const need = Math.round(pool.M[stat] * mult);
        return {
            type, stat, need, rounds: 3,
            text: `every castle needs at least ${need} ${stat} or loose ${(4 - mult) * 10} hp`,
            holds: (all) => all.every(s => s[stat] >= need),
            damage: (4 - mult) * 10,
        };
    }

    const loss = Math.abs(ranges[stat][0]) * randInt(1, 2);
    return {
        type, stat, loss, rounds: 3,
        text: `every castle loses ${loss} ${stat}`,
        resolve: (all) => all.forEach(s => { s[stat] -= loss; }),
    };
}

let challenge = genChallenge();

function showChallenge() {
    Challenge.name.innerText = challenge.text;
    Challenge.rounds.innerText = `rounds left: ${challenge.rounds}`;
}
showChallenge();

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
        [btn1, btn2, btn3, btn4].forEach(b => { if (!b.disabled) genCardOn(b); });
        showTokens();
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
            setStats();
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

const maxV = {
    money: 500,
    military: 50,
    naval: 10,
    PR: 100,
    size: 40,
    tech: 10,
    luck: 100,
    hp: 200
};

function setStats() {
    for (let i = 0; i<stats.length; i++) {
        stats[i].castle.innerHTML = '';
        ['money','military','naval','PR','size','tech','luck','hp'].forEach(n => {
            stats[i].castle.innerHTML += `
            <p class='${n}'   >${n}:        ${stats[i][n]}</p>
            <div class="bar"><i style="width: ${Math.max(0,Math.min(stats[i][n]/maxV[n] * 100,100))}%"       class='${n}'></i></div>`
        })
    }
}
setStats();