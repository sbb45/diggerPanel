# README

Проект на Next.js, созданный с помощью `create-next-app`.

---

## Как запустить

1. Установить зависимости:

```bash
npm install
# или
yarn
# или
pnpm install
```

2. Запустить дев-сервер:

```bash
npm run dev
# или
yarn dev
# или
pnpm dev
```

Открыть в браузере: [http://localhost:3000](http://localhost:3000)

---

## Как собрать (build)

```bash
npm run build
# или
yarn build
# или
pnpm build
```

После сборки можно запустить продакшен-сервер:

```bash
npm start
# или
yarn start
# или
pnpm start
```

---

## Важная информация

Адрес API статичен и находится в файле `src/lib/const.ts`.
При необходимости измените API URL именно там.

При сборке все файлы из out закинуть в папку admin и все будет четко.

---

## Дополнительно

* Редактируйте страницы в папке `app` — изменения применяются автоматически при запуске dev-сервера.
* Документация Next.js: [https://nextjs.org/docs](https://nextjs.org/docs)
* Для деплоя рекомендуем использовать платформу Vercel.
