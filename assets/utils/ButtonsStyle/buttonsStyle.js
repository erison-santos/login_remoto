      // Menu Navigation
      async function carregarButtons() {
        const buttonsGroup = document.getElementById("buttons-group")
        try {
          const response = await fetch(
            "../../assets/utils/ButtonsStyle/buttonsStyle.html"
          )
          const html = await response.text()
          buttonsGroup.innerHTML = html

          // Reexecuta scripts internos, se houver
          const scripts = buttonsGroup.querySelectorAll("script")
          scripts.forEach((oldScript) => {
            const newScript = document.createElement("script")
            newScript.text = oldScript.text
            document.body.appendChild(newScript)
            oldScript.remove()
          })

          const buttonStyle = document.getElementById("main-buttons")

          if (buttonStyle) {
            window.addEventListener("scroll", () => {
              if (window.scrollY > 0) {
                buttonStyle.classList.add("fixed")
              } else {
                buttonStyle.classList.remove("fixed")
              }
            })
          }
        } catch (err) {
          console.error("Erro ao carregar o componente de botões:", err)
        }
      }

      carregarButtons()