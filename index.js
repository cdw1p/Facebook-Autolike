const fetch = require('node-fetch')
require('colors')

// Global Variable
let ACCESS_TOKEN = 'EAAAAZAw4FxQIBAN5wVxjs9ciqZAs5wXVQiTOgHgLoz5vGWNZBzGRZCKfl7cGVHcxg7z0UlDPtJPHjRUkPHw2JNcvfMrllyvJ2BX4elCsX7I3Imm6xUPUMNntLeS3Yn3ZBKgoIK1bP6FKQAJh9QKSkCurmzvBJhzypIdLgvzoEUwZDZD'

const getFriendList = () => new Promise((resolve, reject) => {
  try {
    fetch(`https://graph.facebook.com/v6.0/me/friends?limit=5000&access_token=${ACCESS_TOKEN}`)
    .then(res => res.json())
    .then(result => {
      if (result.error) {
        resolve({ status: false, message: result.error.message })
      } else {
        resolve({ status: true, message: result.data })
      }
    })
  } catch(e) {
    reject(e)
  }
})


;(async () => {
  try { 
    let resGFL = await getFriendList()

    if (resGFL.status) {
      console.log(resGFL.message)
    } else {
      console.log(`[ERR] Message : ${resGFL.message}`.red)
    }
  } catch(e) {
    console.log(e)
  }
})()