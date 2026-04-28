
let filmAdatok = null;
let valasztottHelyek = new Set();
const teremInfok = {
    1: { ferohely: 42, sor: 7, szek_per_sor: 6 },
    2: { ferohely: 60, sor: 10, szek_per_sor: 6 },
    3: { ferohely: 25, sor: 5, szek_per_sor: 5 }
};

window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filmId = urlParams.get('filmId');
    if (filmId) {
        filmBetoltese(filmId);
    }
};

function filmBetoltese(filmId) {
    fetch("filmek.json")
        .then(response => response.json())
        .then(data => {
            filmAdatok = data.find(f => f.id == filmId);
            if (filmAdatok) {
                filmInfoMegjelenites();
                teremMegjelenites();
            }
        })
        .catch(error => console.error("Hiba:", error));
}

function filmInfoMegjelenites() {
    document.getElementById("film-kep").src = "img/" + filmAdatok.kep;
    document.getElementById("film-nev").textContent = filmAdatok.nev;
    document.getElementById("film-producer").textContent = filmAdatok.producer;
    document.getElementById("film-hossz").textContent = filmAdatok.hossz_perc;
    document.getElementById("film-ar").textContent = filmAdatok.jegy_ar;
    document.getElementById("film-terem").textContent = filmAdatok.terem;
    document.getElementById("film-vege").textContent = filmAdatok.vetites_vege;
    document.getElementById("film-leiras").textContent = filmAdatok.leiras;
}

function teremMegjelenites() {
    const terem = filmAdatok.terem;
    const teremInfo = teremInfok[terem];
    const container = document.getElementById("terem-container");
    
    container.innerHTML = `<div class="terem">
        <h3>${terem}. Terem (${teremInfo.ferohely} fő)</h3>
    </div>`;

    for (let sor = 1; sor <= teremInfo.sor; sor++) {
        const sorDiv = document.createElement("div");
        sorDiv.className = "szeksor";
        
        for (let szek = 1; szek <= teremInfo.szek_per_sor; szek++) {
            const szekDiv = document.createElement("div");
            szekDiv.className = "szek";
            szekDiv.textContent = `${sor}${String.fromCharCode(64 + szek)}`;
            const szekId = `${sor}-${szek}`;
            szekDiv.id = szekId;
            
            szekDiv.onclick = () => szekValasztas(szekId, szekDiv);
            sorDiv.appendChild(szekDiv);
        }
        
        container.appendChild(sorDiv);
    }
}

function szekValasztas(szekId, szekDiv) {
    if (valasztottHelyek.has(szekId)) {
        valasztottHelyek.delete(szekId);
        szekDiv.classList.remove("valasztott");
    } else {
        valasztottHelyek.add(szekId);
        szekDiv.classList.add("valasztott");
    }
    
    osszarSzamitas();
}

function osszarSzamitas() {
    const osszar = valasztottHelyek.size * filmAdatok.jegy_ar;
    document.getElementById("valasztott-helyek").textContent = valasztottHelyek.size;
    document.getElementById("osszar").textContent = osszar;
    
    const vegalegitGomb = document.getElementById("vegalegit-gomb");
    if (valasztottHelyek.size > 0) {
        vegalegitGomb.disabled = false;
    } else {
        vegalegitGomb.disabled = true;
    }
}

const fs = require('fs');

function vegalegites() {
    if (valasztottHelyek.size === 0) {
        alert("Kérlek válassz ki legalább egy helyet!");
        return;
    }

    const helyekSzama = valasztottHelyek.size;
    const osszar = helyekSzama * filmAdatok.jegy_ar;

    const tartalom = 
    `   ===== MOZI JEGY =====

    Film: ${filmAdatok.nev}
    Producer: ${filmAdatok.producer}
    Terem: ${filmAdatok.terem}

    Kiválasztott helyek:
    ${[...valasztottHelyek].join(', ')}

    Helyek száma: ${helyekSzama}

    Jegy ár: ${filmAdatok.jegy_ar} Ft
    Összesen: ${osszar} Ft

    Kezdés: ${filmAdatok.kezdes_idopont}

    ====================`;

    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(tartalom);
    link.download = 'jegy.txt';
    link.click();

    const sikerUzenet = document.getElementById("siker-uzenet");
    sikerUzenet.style.display = "block";

    setTimeout(() => {
        visszateresAFilmekhez();
    }, 2000);
}

