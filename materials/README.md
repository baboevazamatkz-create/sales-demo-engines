# Учёт материалов

Минималистичное приложение: «Сканировать» → фото упаковки → ИИ читает
надпись и предлагает название и количество → вы правите, если нужно, и
подтверждаете → запись попадает в базу. Кнопка **Excel** скачивает базу
файлом `.xlsx` с двумя листами:

- **Остатки** — материал, суммарное количество, единица, фасовка, дата
  последнего поступления;
- **Журнал** — каждое добавление отдельной строкой.

Файл можно загрузить обратно (Настройки → «Загрузить из Excel», читается
лист «Журнал») — так база переносится на другой телефон.

Приложение — один файл `index.html`, без сборки. База хранится в браузере
на устройстве; Excel — её выгрузка и резервная копия.

Кнопка «+» рядом со сканером добавляет материал вручную, без фото.

## Где открыть

После слияния в `main` workflow Deploy публикует его на GitHub Pages:

```
https://baboevazamatkz-create.github.io/sales-demo-engines/materials/
```

На телефоне: «Поделиться» → «На экран Домой», и оно открывается как
приложение. Локально — просто открыть `materials/index.html` в браузере.

## Распознавание: воркер Cloudflare

Та же связка, что в проекте Solidus: ключ Anthropic нельзя класть в
страницу, поэтому между ней и ИИ стоит воркер `materials/worker`. Он
хранит ключ у себя, пускает только с кодом доступа и возвращает
разобранный ответ.

### Развёртывание

```bash
cd materials/worker
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY   # ключ с console.anthropic.com
npx wrangler secret put ACCESS_CODE         # любой придуманный пароль
npx wrangler deploy
```

Последняя команда напечатает адрес `https://materials-scan.<имя>.workers.dev`.

Без Node.js — через браузер: dash.cloudflare.com → Workers & Pages →
Create → Hello World → Deploy → Edit code → вставить
`materials/worker/src/index.js` → Deploy. Затем Settings → Variables and
Secrets: секреты `ANTHROPIC_API_KEY` и `ACCESS_CODE`, текст
`MODEL` = `claude-haiku-4-5-20251001`.

Можно не заводить новый аккаунт, а положить этот воркер рядом с
`solidus-scan` в тот же Cloudflare — ключ Anthropic тот же.

### Подключение

В приложении: шестерёнка → адрес воркера и код доступа → «Сохранить».
Или одной ссылкой — удобно отправить себе на телефон:

```
https://baboevazamatkz-create.github.io/sales-demo-engines/materials/#endpoint=https://materials-scan.<имя>.workers.dev&code=<код>
```

Приложение запомнит настройки и уберёт их из адресной строки.

### Проверка

```bash
curl https://materials-scan.<имя>.workers.dev
# materials-scan ok
curl -X POST https://materials-scan.<имя>.workers.dev -d '{}'
# {"error":"Неверный код доступа"}
```

### Ответ воркера

```json
{
  "items": [
    { "name": "Цемент М500 Д0", "quantity": 3, "unit": "меш",
      "package": "50 кг", "confidence": 0.95 }
  ]
}
```

Единицы: шт, кг, г, т, л, мл, м, м², м³, уп, рул, меш, лист.

### Стоимость

Одно фото — около полутора тысяч входных токенов на Haiku, то есть доли
цента. Суточный предел — `DAILY_LIMIT` в `wrangler.toml`, включается
подключением KV-хранилища `SCAN_QUOTA` (инструкция в самом файле).
