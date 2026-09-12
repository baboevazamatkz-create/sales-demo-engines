# Sales Demo Engines

Готовые "движки" для холодных демо под три ниши — кафе/ресторан, магазин/ритейл,
доставка. Под конкретного клиента демо собирается за 10 минут: копируете
конфиг, меняете название/товары/цвета/лого — код не трогаете.

React + Vite + TypeScript + Tailwind + lucide-react. Один и тот же билд
работает как ссылка в браузере (с телефонной рамкой для презентабельности)
и как реальное приложение через Capacitor (без рамки — определяется
автоматически в рантайме).

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте `http://localhost:5173` — попадёте в галерею всех клиентских демо.
Кликните на клиента, либо сразу откройте `http://localhost:5173/?client=polyn-cafe`.

Готовые демо из коробки:

| clientId        | Ниша            | Что это |
|------------------|-----------------|---------|
| `polyn-cafe`     | cafe-restaurant | Кофейня "Полынь" — доставка/самовывоз/заказ за столик |
| `urban-thread`   | retail          | Магазин одежды с фильтрами и вариантами (размер/цвет) |
| `bloom-express`  | delivery        | Доставка цветов с трекингом статуса заказа |

## Архитектура

```
src/
  types/config.ts          — общие типы (BrandTheme, BusinessInfo, BaseClientConfig)
  engines/
    cafe-restaurant/        — движок №1: меню → карточка → корзина → оформление → подтверждение
    retail/                 — движок №2: каталог+фильтры → карточка (варианты) → корзина → оформление → "заказ принят"
    delivery/                — движок №3: как кафе, но вместо success — трекинг статуса
  components/
    ui/                     — общие примитивы (QuantityStepper, ChipTabs, BackHeader, ProgressTracker, ...)
    screens/ItemDetailScreen.tsx — общий экран карточки товара для cafe-restaurant и delivery
    EngineHost.tsx           — выбирает нужный движок по config.niche
    Gallery.tsx               — витрина всех клиентских демо
  hooks/useCart.ts           — универсальная корзина (generic по типу строки корзины)
  lib/
    theme.ts                — применяет BrandTheme клиента как CSS-переменные
    clientRegistry.ts        — автоматически подхватывает все src/clients/*/config.json
    platform.ts               — определяет, что приложение работает внутри Capacitor (native), а не в браузере
  clients/
    <client-id>/config.json  — конфиг конкретного клиента (единственное, что меняется под нового клиента)
    _templates/<niche>/config.json — шаблон для новых клиентов (не попадает в галерею)
```

Каждый движок — это **не** переиспользуемый компонент "на все ниши", а
отдельный набор экранов под свою нишу (у ритейла есть фильтры и варианты
товара, у доставки — трекинг, у кафе — режимы заказа). Общее вынесено в
`components/ui` и `hooks/useCart`, специфика каждой ниши — в её собственном
`config.json` и папке `src/engines/<niche>`.

## Кастомизация под клиента (без правки кода)

1. Скопируйте шаблон нужной ниши:
   ```bash
   npm run new-client -- --niche cafe-restaurant --id my-client --name "Название"
   ```
   Это создаст `src/clients/my-client/config.json` и `public/clients/my-client/`
   для логотипа и фото.
2. Отредактируйте `config.json`: `business` (название/слоган/адрес/валюта),
   `theme` (6 цветов — primary/primarySoft/primaryContrast/accent/градиент
   плейсхолдера), список категорий и товаров.
3. Положите лого и фото в `public/clients/my-client/` и укажите пути в
   конфиге (`"logoUrl": "/clients/my-client/logo.png"`, аналогично `imageUrl`
   / `images`). Если фото нет — движок сам покажет цветной градиент-плейсхолдер.
4. Проверьте: `npm run dev` → `/?client=my-client`.

Ничего в `src/engines/*` менять не нужно — весь клиентский вид собирается из
конфига. Чтобы добавить нового клиента в уже существующую нишу — это ровно
шаги 1–4, без единого изменения в коде движка.

## Добавление новой ниши (4-й движок и т.д.)

1. `src/engines/<новая-ниша>/types.ts` — расширьте `BaseClientConfig` из
   `src/types/config.ts` (как сделано в cafe-restaurant/retail/delivery).
2. Соберите экраны в `src/engines/<новая-ниша>/`, максимально переиспользуя
   `src/components/ui/*` и (если состав похож на кафе/доставку)
   `src/components/screens/ItemDetailScreen.tsx`.
3. Заведите `<Niche>Engine.tsx` — стейт-машину экранов, как в остальных трёх
   движках, и `index.ts`-барель с экспортами.
4. Добавьте `case` в `src/components/EngineHost.tsx` и новый вариант в
   `Niche` (`src/types/config.ts`) — TypeScript подскажет, если забудете
   обновить `EngineHost`, за счёт exhaustiveness-проверки в `switch`.
5. `src/clients/_templates/<новая-ниша>/config.json` — шаблон для
   `new-client.mjs`.

## Сборка

- **Галерея всех демо** (для внутреннего показа/шаринга нескольких клиентов
  с одного билда): `npm run build` → статика в `dist/`. Задеплоить на любой
  статический хостинг (Vercel/Netlify/Cloudflare Pages — репозиторий уже
  является корнем проекта, дополнительно ничего указывать не нужно). Ссылка
  на конкретного клиента — `<домен>/?client=<id>`, ссылка без параметра —
  сама галерея.

  GitHub Pages уже настроен (`.github/workflows/deploy.yml`) — при каждом
  push в `main` галерея автоматически собирается и публикуется на
  `https://baboevazamatkz-create.github.io/sales-demo-engines/`. Разовая
  настройка (уже нужно сделать один раз вручную, иначе Pages не активирован):
  **Settings → Pages → Source → "GitHub Actions"** — сам workflow включить
  Pages для репозитория не может, это ограничение прав токена.
- **Изолированный билд под одного клиента** (не видно ни галереи, ни других
  клиентов — то, что реально отправляется клиенту как "вот ваша ссылка/APK"):
  ```bash
  npm run build:client -- --id polyn-cafe
  # → dist-clients/polyn-cafe
  ```
  Опционально `--base /polyn-cafe/`, если хостите под-путём.

## Мобильная сборка (Android APK / iOS TestFlight) через Capacitor

Движок сам определяет, что он запущен внутри Capacitor (`lib/platform.ts`),
и в этом случае не рисует "телефонную рамку" — на реальном устройстве
контент растягивается на весь экран.

```bash
npm run build:client -- --id polyn-cafe   # соберёт dist-clients/polyn-cafe
cp -r dist-clients/polyn-cafe dist        # capacitor.config.ts берёт ./dist по умолчанию
npx cap add android                        # один раз — создаёт android/
npx cap add ios                            # один раз — создаёт ios/ (нужен macOS + Xcode)
npx cap sync
```

Дальше:

- **Android APK**: `cd android && ./gradlew assembleDebug` (debug-сборка,
  ставится на любое Android-устройство) или откройте `android/` в Android
  Studio для `Build > Generate Signed Bundle/APK` под релиз. В CI это уже
  настроено — см. `.github/workflows/ci.yml`, job
  `build-client-android` (можно запустить вручную из вкладки Actions,
  указав `client_id`, скачать APK из артефактов запуска).
- **iOS / TestFlight**: откройте `ios/App/App.xcworkspace` в Xcode на
  macOS, укажите свою команду разработчика (Apple Developer аккаунт) и
  соберите Archive → Distribute App → TestFlight. Это шаг, который нельзя
  автоматизировать без доступа к Apple-аккаунту агентства, поэтому в CI его
  нет — задокументирован здесь как ручная процедура.

`appId`/`appName` для конкретного клиента переопределяются переменными
окружения перед `npx cap sync` (см. `capacitor.config.ts`):

```bash
CAPACITOR_APP_ID=com.agency.polynDemo CAPACITOR_APP_NAME="Полынь demo" npx cap sync
```

## Клонирование движка под нового клиента — итого

Быстрый путь (99% случаев, меняются только данные):
`npm run new-client` → правка `config.json` → положить лого/фото → билд.

Ничего в `src/engines/*` копировать не нужно — один и тот же код движка
обслуживает всех клиентов этой ниши одновременно (это и есть весь смысл
конфиг-архитектуры).
