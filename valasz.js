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
          <h3>${film.nev}</h3>
          <p><strong>Producer:</strong> ${film.producer}</p>
          <p><strong>Hossz:</strong> ${film.hossz_perc} perc</p>
          <p><strong>Jegyár:</strong> ${film.jegy_ar} Ft</p>
          <p><strong>Terem:</strong> ${film.terem}</p>
          <p><strong>Hét vége:</strong> ${film.vetites_vege}</p>
          <button onclick="ujLap()"> Mozijegy_vasarlas</button>
        `;

        container.appendChild(kartya);
      });
    })
    .catch(error => console.error("Hiba:", error));
}

function ujLap() {
  window.location.href = "arusit.html";
};

window.ujLap = ujLap; 

window.onload = filmbetoltese;