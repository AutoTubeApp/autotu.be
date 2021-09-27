# Frontend

## No authentication needed

- GET / -> index

- GET /auth/sign-in -> sign in
- GET /auth/create-account -> create account
- GET /auth/validate-account/:id -> validate email and complete profile
- GET /auth/password-lost -> 1 step of reset password
- GET /auth/reset-password/:id -> validate by email and new password form

## Auth or not

- GET /u/:user -> user main feed (with all channels)
- GET /c/:channel -> channel
- GET /c/:channel/watch/:vuuid

## Auth needed

- GET /setting/account -> update account details

- GET /v/add -> add a new video
- GET /v/:vuuid/edit

# API 
