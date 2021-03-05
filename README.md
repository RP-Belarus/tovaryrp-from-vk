## Запуск:

    npm start  ( = `node index.js`)
Или 
    
    npm run dev ( = `nodemon index.js`)

## Heroku
Деплой на Heroku:

    heroku login
    git push heroku main

Проверить переменные среды:

    heroku config

Установить переменные среды:

    heroku config:set ACCESS_TOKEN=your_access_token_here
    heroku config:set MONGO_USER=your_user
    heroku config:set MONGO_PASS=your_password
    
См. результат:
https://tovaryrp-from-vk.herokuapp.com/