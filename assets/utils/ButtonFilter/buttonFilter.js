// buttonFilter.js
function initButtonFilter({
  jsonPath,
  buildCardHTML,
  galleryId = "gallery-grid",
  categoriaId = "categoria-buttons",
  subcategoriaId = "subcategoria-buttons"
}) {
  document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById(galleryId)
    const categoriaGroup = document.getElementById(categoriaId)
    const subcategoriaGroup = document.getElementById(subcategoriaId)

    if (!container || !categoriaGroup || !subcategoriaGroup) {
      console.error("Elementos não encontrados para filtros.")
      return
    }

    container.innerHTML = ""
    categoriaGroup.innerHTML = ""
    subcategoriaGroup.innerHTML = ""

    const filtrar = (attr, valor) => {
      document.querySelectorAll(".gallery-item").forEach(item => {
        item.style.display =
          valor === "all" || item.dataset[attr] === valor ? "block" : "none"
      })
    }

    try {
      const response = await fetch(jsonPath)
      const items = await response.json()

      const categorias = new Set()
      const subcategorias = new Set()

      items.forEach(item => {
        if (item.category) categorias.add(item.category)
        if (item.subcategory) subcategorias.add(item.subcategory)
      })

      // Criação de botões de categoria
      categoriaGroup.appendChild(criarBotaoCategoria("Todos", "all", true))
      categorias.forEach(c =>
        categoriaGroup.appendChild(criarBotaoCategoria(c, c))
      )

      // Criação de botões de subcategoria
      subcategoriaGroup.appendChild(criarBotaoSubcategoria("Todos", "all", true))
      subcategorias.forEach(sc =>
        subcategoriaGroup.appendChild(criarBotaoSubcategoria(sc, sc))
      )

      // Eventos
      categoriaGroup.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
          categoriaGroup.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
          button.classList.add("active")
          filtrar("category", button.dataset.category)
        })
      })

      subcategoriaGroup.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
          subcategoriaGroup.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
          button.classList.add("active")
          filtrar("subcategory", button.dataset.subcategory)
        })
      })

      // Criar cards
      items.forEach(item => {
        const col = document.createElement("div")
        col.className = "col-md-3 gallery-item"
        col.dataset.category = item.category
        col.dataset.subcategory = item.subcategory
        col.innerHTML = buildCardHTML(item)
        container.appendChild(col)
      })
    } catch (err) {
      console.error("Erro ao carregar dados:", err)
      container.innerHTML = `<p style="color:red;">Erro ao carregar dados.</p>`
    }
  })

  function criarBotaoCategoria(label, value, ativo = false) {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = `btn btn-outline-warning filter-btn ${ativo ? "active" : ""}`
    btn.dataset.category = value
    btn.textContent = label
    return btn
  }

  function criarBotaoSubcategoria(label, value, ativo = false) {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = `btn btn-sm btn-outline-secondary filter-btn ${ativo ? "active" : ""}`
    btn.dataset.subcategory = value
    btn.textContent = label
    return btn
  }
}
