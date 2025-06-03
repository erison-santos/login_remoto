let allApps = []

/* Função para renderizar os apps dinamicamente */
function renderApps(apps) {
    const container = document.getElementById("app-container")
    const noResultsMessage = document.getElementById("no-results-message")
    container.innerHTML = ""

    if (apps.length === 0) {
        fetch("../../assets/utils/ResultsFound/resultsfound.html")
            .then((res) => res.text())
            .then((html) => {
                noResultsMessage.innerHTML = html
                noResultsMessage.style.display = "block"
            })
            .catch((err) => {
                console.error("Erro ao carregar resultsfound.html:", err)
                noResultsMessage.innerHTML =
                    "<p style='color:red;'>Erro ao exibir animação.</p>"
                noResultsMessage.style.display = "block"
            })
        return
    } else {
        noResultsMessage.innerHTML = ""
        noResultsMessage.style.display = "none"
    }

    const grouped = apps.reduce((acc, app) => {
        acc[app.category] = acc[app.category] || []
        acc[app.category].push(app)
        return acc
    }, {})

    Object.keys(grouped).forEach((category) => {
        const section = document.createElement("section")

        const header = document.createElement("header")
        header.innerHTML = `<h1>${category}</h1>`
        section.appendChild(header)

        grouped[category].forEach((app) => {
            const article = document.createElement("article")
            article.style.setProperty("--avarage-color", app.color)
            article.innerHTML = `
          <a class="downloadLink" href="${app.download}" download>
            <figure>
              <img src="${app.image}" alt="${app.name}" />
              <figcaption>${app.name}</figcaption>
            </figure>
          </a>
        `
            section.appendChild(article)
        })

        container.appendChild(section)
    })
}

fetch("/data/apps.json")
    .then((res) => res.json())
    .then((apps) => {
        allApps = apps
        renderApps(allApps)
    })
    .catch((err) => {
        console.error("Erro ao carregar os aplicativos:", err)
    })