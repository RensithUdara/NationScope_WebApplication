document.addEventListener('DOMContentLoaded', loadcountries);

async function loadcountries() {
    const res = await fetch("https://restcountries.com/v3.1/all");
    const countries = await res.json();
    displayCountries(countries);
}

function displayCountries(countries) {
    const row = document.getElementById("row");
    let body = "";

    countries.forEach((element) => {
        body += `
            <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="card-country">
                    <img src="${element.flags.png}" alt="${element.name.common}" loading="lazy">
                    <div class="card-country-body">
                        <h5 class="card-country-title">${element.name.common}</h5>
                        <p class="card-country-info">
                            <b>Region:</b> ${element.region}<br>
                            <b>Population:</b> ${element.population.toLocaleString()}<br>
                            <b>Capital:</b> ${element.capital ? element.capital[0] : "N/A"}<br>
                            <b>Area:</b> ${element.area.toLocaleString()} km²<br>
                            <b>Timezone:</b> ${element.timezones.join(", ")}
                        </p>
                    </div>
                </div>
            </div>
        `;
    });

    row.innerHTML = body;
}

function searchCountry() {
    const searchValue = document.getElementById("txtSearch").value.trim();
    if (!searchValue) return;

    fetch(`https://restcountries.com/v3.1/name/${searchValue}`)
        .then((res) => res.json())
        .then((data) => displayCountries(data))
        .catch(() => alert("No countries found"));
}

function filterByRegion() {
    const region = document.getElementById("regionFilter").value;

    if (!region) {
        loadcountries();
        return;
    }

    fetch(`https://restcountries.com/v3.1/region/${region}`)
        .then((res) => res.json())
        .then((data) => displayCountries(data));
}

function filterByPopulation() {
    const population = document.getElementById("populationFilter").value;

    fetch("https://restcountries.com/v3.1/all")
        .then((res) => res.json())
        .then((data) => {
            const filtered = data.filter((country) => {
                if (population === "low") return country.population < 1000000;
                if (population === "medium")
                    return country.population >= 1000000 && country.population <= 50000000;
                if (population === "high") return country.population > 50000000;
                return true;
            });
            displayCountries(filtered);
        });
}
