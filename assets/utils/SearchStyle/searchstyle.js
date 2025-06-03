async function carregarSearchStyle() {
    const placeholder = document.getElementById("search-placeholder")
    try {
        const response = await fetch(
            "../../assets/utils/SearchStyle/searchstyle.html"
        )
        const html = await response.text()
        placeholder.innerHTML = html

        // Reexecuta scripts internos, se houver
        const scripts = placeholder.querySelectorAll("script")
        scripts.forEach((oldScript) => {
            const newScript = document.createElement("script")
            newScript.text = oldScript.text
            document.body.appendChild(newScript)
            oldScript.remove()
        })

        // ✅ Adiciona o evento no input após carregá-lo
        const input = document.getElementById("search-input")
        if (input) {
            input.addEventListener("input", (e) => {
                const query = e.target.value.toLowerCase()
                const filtered = allApps.filter((app) =>
                    app.name.toLowerCase().includes(query)
                )
                renderApps(filtered)
            })
        }
    } catch (err) {
        console.error("Erro ao carregar o componente de busca:", err)
    }

    const searchBar = document.getElementById("search-bar")

    if (searchBar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 0) {
                searchBar.classList.add("fixed")
            } else {
                searchBar.classList.remove("fixed")
            }
        })
    }
}
carregarSearchStyle()