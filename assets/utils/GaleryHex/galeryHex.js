async function carregarGaleria() {
  const container = document.getElementById("galeria-container")
  const response = await fetch(
    "../../assets/utils/GaleryHex/galeryHex.html"
  )
  const html = await response.text()
  container.innerHTML = html

  // Reexecuta qualquer script interno
  const scripts = container.querySelectorAll("script")
  scripts.forEach((oldScript) => {
    const newScript = document.createElement("script")
    newScript.text = oldScript.text
    document.body.appendChild(newScript)
    oldScript.remove()
  })
}

carregarGaleria()