function copyToClipboard(text) {
   navigator.clipboard.writeText(text)
      .then(() => {
         console.log('Скопировано')
      })
      .catch(error => {
         console.error(`Текст не скопирован ${error}`)
      })
}