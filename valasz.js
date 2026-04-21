function filmbetoltese() {
  fetch("filmek.json")
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("film-container");

      container.innerHTML = "";

      data.forEach(film => {
        const kartya = document.createElement("div");
        kartya.classList.add("film-kartya");

        kartya.innerHTML = `
          <img class="kepek" src="${film.kep_url || 'img/' + film.kep}" alt="${film.nev}">
          <h3>${film.nev}</h3>
          <p><strong>Producer:</strong> ${film.producer}</p>
          <p><strong>Hossz:</strong> ${film.hossz_perc} perc</p>
          <p><strong>Jegyár:</strong> ${film.jegy_ar} Ft</p>
          <p><strong>Terem:</strong> ${film.terem}</p>
          <p><strong>Vetítés vége:</strong> ${film.vetites_vege}</p>
          <button onclick="ujLap(${film.id})"> Jegy foglalás</button>
        `;

        container.appendChild(kartya);
      });
    })
    .catch(error => console.error("Hiba:", error));
}


function ujLap(filmId) {
  window.location.href = `vasarlas.html?filmId=${filmId}`;
}

window.ujLap = ujLap;

window.onload = filmbetoltese;