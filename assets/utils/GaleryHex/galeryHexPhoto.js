            const base = "unsplash.com/photo"
      const data = [
        {
          img: "/assets/images/team/membro-1.png",
          link: "https://www.instagram.com/adriano_rios1/",
          text: "Lider de TI",
          pos: "47% 35%",
        },
        {
          img: "/assets/images/team/membro-2.png",
          link: "https://www.instagram.com/erison.88/",
          text: "Desenvolvedor Frontend",
          pos: "75% 65%",
        },
        {
          img: "/assets/images/team/membro-3.png",
          link: "https://www.instagram.com/leosantous/",
          text: "Analista de Redes",
          pos: "53% 43%",
        },
        {
          img: "/assets/images/team/membro-4.png",
          link: "https://www.instagram.com/romulossillva/",
          text: "Analista de Sistemas",
          pos: "65% 65%",
        },
      ]

      const gallery = document.getElementById("gallery")

      data.forEach((c, i) => {
        const a = document.createElement("a")
        a.href = c.link
        a.target = "_blank"
        a.style.setProperty("--i", i)

        const img = document.createElement("img")
        img.src = c.img
        img.alt = c.text
        if (c.pos) img.style.objectPosition = c.pos

        a.appendChild(img)
        gallery.appendChild(a)
      })