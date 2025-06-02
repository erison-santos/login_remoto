      async function carregarPops() {
        const container = document.getElementById("gallery-grid")
        const categoriaGroup = document.getElementById("categoria-buttons")
        const subcategoriaGroup = document.getElementById(
          "subcategoria-buttons"
        )

        container.innerHTML = ""
        categoriaGroup.innerHTML = ""
        subcategoriaGroup.innerHTML = ""

        function filtrarPorCategoria(categoria) {
          const items = document.querySelectorAll(".gallery-item")
          items.forEach(item => {
            const itemCategoria = item.dataset.category
            if (categoria === "all" || itemCategoria === categoria) {
              item.style.display = "block"
            } else {
              item.style.display = "none"
            }
          })
        }

        function filtrarPorSubcategoria(subcategoria) {
          const items = document.querySelectorAll(".gallery-item")
          items.forEach(item => {
            const itemSubcategoria = item.dataset.subcategory
            if (subcategoria === "all" || itemSubcategoria === subcategoria) {
              item.style.display = "block"
            } else {
              item.style.display = "none"
            }
          })
        }

        try {
          const response = await fetch("../../data/pops.json")
          const pops = await response.json()

          const categorias = new Set()
          const subcategorias = new Set()

          pops.forEach((pop) => {
            if (pop.category) categorias.add(pop.category)
            if (pop.subcategory) subcategorias.add(pop.subcategory)
          })

          // Botão "Todos" fixo para categorias
          categoriaGroup.appendChild(criarBotaoCategoria("Todos", "all", true))
          categorias.forEach((categoria) =>
            categoriaGroup.appendChild(
              criarBotaoCategoria(categoria, categoria)
            )
          )

          // Botão "Todos" fixo para subcategorias
          subcategoriaGroup.appendChild(
            criarBotaoSubcategoria("Todos", "all", true)
          )
          subcategorias.forEach((subcategoria) =>
            subcategoriaGroup.appendChild(
              criarBotaoSubcategoria(subcategoria, subcategoria)
            )
          )

          // Adiciona eventos aos botões de categoria
          categoriaGroup.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
              
              categoriaGroup.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
              button.classList.add("active")

              const categoria = button.dataset.category
              filtrarPorCategoria(categoria)
            })
          })

          // Adiciona eventos aos botões de subcategoria
          subcategoriaGroup.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {

              subcategoriaGroup.querySelectorAll("button").forEach(btn => btn.classList.remove("active"))
              button.classList.add("active")

              const subcategoria = button.dataset.subcategory
              filtrarPorSubcategoria(subcategoria)
            })
          })

          // Percorrer os pops e criar os cards
          pops.forEach((pop) => {
            const col = document.createElement("div")
            col.className = "col-md-3 gallery-item"
            col.dataset.category = pop.category
            col.dataset.subcategory = pop.subcategory

            col.innerHTML = `
          <div class="pop-link">
            <a href="${pop.url}" data-caption="${pop.description}" target="_blank">
              <img src="${pop.thumbnail}" alt="${pop.title}">
              <div>
                <h6>${pop.title}</h6>
                <footer>
                  <p class="mb-0"><small>${pop.type}</small></p>
                </footer>
              </div>
            </a>
          </div>
        `

            container.appendChild(col)
          })
        } catch (err) {
          console.error("Erro ao carregar vídeos:", err)
          container.innerHTML = `<p style="color:red;">Erro ao carregar vídeos.</p>`
        }
      }

      // Funções auxiliares para criar botões
      function criarBotaoCategoria(label, value, ativo = false) {
        const btn = document.createElement("button")
        btn.type = "button"
        btn.className = `btn btn-outline-warning filter-btn ${
          ativo ? "active" : ""
        }`
        btn.dataset.category = value
        btn.textContent = label
        return btn
      }

      function criarBotaoSubcategoria(label, value, ativo = false) {
        const btn = document.createElement("button")
        btn.type = "button"
        btn.className = `btn btn-sm btn-outline-secondary filter-btn ${
          ativo ? "active" : ""
        }`
        btn.dataset.subcategory = value
        btn.textContent = label
        return btn
      }

      document.addEventListener("DOMContentLoaded", carregarPops)