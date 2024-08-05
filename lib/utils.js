      //生成主题色
      Utils.idle(() => {
        const player = this.computeNowPlayer(Mpris.players);
        const cover = player["cover-path"] || defaultCoverPath;
        Utils.execAsync([`bash`, `-c`, `wal -i ${cover} -n -t -s -e -q && cat ~/.cache/wal/colors.json`]).then(tmpStr => {
          try {
            const colorScheme = JSON.parse(tmpStr)
            if (colorScheme.colors && colorScheme.colors.color1) {
              console.log(colorScheme.colors.color1)
              const bg = hexToRgba(colorScheme.colors.color1, 0.7)
              self.setCss(`background-color:${bg};border-radius:2rem;`)
            }
          } catch (e) {
            console.error(e)
          }
        })
      }, 1000)

