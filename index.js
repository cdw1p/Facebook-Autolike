const fetch = require('node-fetch')
const moment = require('moment')
require('colors')

// Global Variable
let ACCESS_TOKEN = 'EAAMn9cDHnDYBAL13NlZCOBMJZB6tqA4TM4ybnNwBmdhew9yvSQxh1RZAjv5qjGEXoXLZApqPWkxcDZAZAnlNP3i57yetRUc3ZAPQyubdXPaaj7dnmClKhaWV7a0oqh5mjZCPeLbP6OPWJ1FWlfeNFlZBbu9X9iQGEkVKGu1oSVQKfvZC45Fq5S5ZCs6HJjjAS1HkKsZD'
let APP_ID = '888361384909878'
let APP_SECRET = '23dfa9ee99604dfc02592ec1fcc6c0f6'

const getLifetimeToken = () => new Promise((resolve, reject) => {
  try {
    fetch(`https://graph.facebook.com/v6.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${ACCESS_TOKEN}`)
    .then(res => res.json())
    .then(result => {
      if (result.error) {
        resolve({ status: false, message: result.error.message })
      } else {
        resolve({ status: true, message: result.access_token })
      }
    })
  } catch(e) {
    reject(e)
  }
})

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

const getFriendPost = (USER_ID) => new Promise((resolve, reject) => {
  try {
    fetch(`https://graph.facebook.com/v6.0/${USER_ID}/feed?fields=id,permalink_url&limit=1&access_token=${ACCESS_TOKEN}`)
    .then(res => res.json())
    .then(result => {
      if (result.error) {
        resolve({ status: false, message: result.error.message })
      } else {
        resolve({ status: true, message: result.data[0] })
      }
    })
  } catch(e) {
    reject(e)
  }
})

const postLikeStatus = (POST_ID) => new Promise((resolve, reject) => {
  try {
    fetch(`https://graph.facebook.com/${POST_ID}/likes?method=POST&access_token=${ACCESS_TOKEN}`)
    .then(res => res.text())
    .then(result => resolve(result))
  } catch(e) {
    reject(e)
  }
})

const startAutolike = (listFriend) => new Promise((resolve, reject) => {
  try {
    listFriend.forEach((data, i) => {
      setTimeout(async () => {
        let getPostId = await getFriendPost(data.id)
        if (getPostId.status) {
          if (await postLikeStatus(getPostId.message.id)) {
            console.log(`[${moment().format('HH:MM:SS')}] Liked ${data.name} 's most recent post`.green)
          } else {
            console.log(`[${moment().format('HH:MM:SS')}] Failed like post ${data.name}`.red)
          }
        } else {
          console.log(`[ERR] Message : ${getPostId.message}`.red)
        }
      }, i*10000)
    })
  } catch(e) {
    reject(e)
  }
})

;(async () => {
  try { 
    let makeLifetimeToken = await getLifetimeToken()
    if (makeLifetimeToken.status) {
      // Set lifetime access token
      ACCESS_TOKEN = makeLifetimeToken.message

      let resGFL = await getFriendList()
      if (resGFL.status) {
        await startAutolike(resGFL.message)
      } else {
        console.log(`[ERR] Message : ${resGFL.message}`.red)
      }
    } else {
      console.log(`[ERR] Message : ${resGFL.message}`.red)
    }
  } catch(e) {
    console.log(e)
  }
})()