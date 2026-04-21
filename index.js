let filmAdatok = null;
let valasztottHelyek = new Set();
let filmekLista = [];
const teremInfok = {
    1: { ferohely: 42, sor: 7, szek_per_sor: 6 },
    2: { ferohely: 60, sor: 10, szek_per_sor: 6 },
    3: { ferohely: 25, sor: 5, szek_per_sor: 5 }
};

window.onload = filmbetoltese;

function filmbetoltese() {
  fetch("filmek.json")
    .then(response => response.json())
    .then(data => {
      filmekLista = data;
      const container = document.getElementById("film-container");

      container.innerHTML = "";

      data.forEach(film => {
        const kartya = document.createElement("div");
        kartya.classList.add("film-kartya");

        kartya.innerHTML = `
          <img src="${film.kep_url}" alt="${film.nev}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 10px;">
          <h3>${film.nev}</h3>
          <p><strong>Producer:</strong> ${film.producer}</p>
          <p><strong>Hossz:</strong> ${film.hossz_perc} perc</p>
          <p><strong>Jegyár:</strong> ${film.jegy_ar} Ft</p>
          <p><strong>Terem:</strong> ${film.terem}</p>
          <p><strong>Vetítés vége:</strong> ${film.vetites_vege}</p>
          <button onclick="vasarlasOldalaAtvalt(${film.id})" class="vasarlas-gomb">Vásárlás</button>
        `;

        container.appendChild(kartya);
      });
    })
    .catch(error => console.error("Hiba:", error));
}

function vasarlasOldalaAtvalt(filmId) {
    filmAdatok = filmekLista.find(f => f.id === filmId);
    if (filmAdatok) {
        valasztottHelyek.clear();
        document.getElementById('siker-uzenet').style.display = 'none';
        filmInfoMegjelenites();
        teremMegjelenites();
        document.getElementById("filmvalasztas-nezes").style.display = "none";
        document.getElementById("vasarlas-nezes").style.display = "block";
    }
}

function visszateresAFilmekhez() {
    document.getElementById("vasarlas-nezes").style.display = "none";
    document.getElementById("filmvalasztas-nezes").style.display = "block";
}

function filmInfoMegjelenites() {
    document.getElementById("film-kep").src = filmAdatok.kep_url;
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

function vegalegites() {
    if (valasztottHelyek.size === 0) {
        alert("Kérlek válassz ki legalább egy helyet!");
        return;
    }
    
    const sikerUzenet = document.getElementById("siker-uzenet");
    sikerUzenet.style.display = "block";
    
    setTimeout(() => {
        visszateresAFilmekhez();
    }, 2000);
}