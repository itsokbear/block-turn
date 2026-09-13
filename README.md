# BlockTurn

Мобильная головоломка 8×8 с вращением фигур, режимами Classic / Serpent и офлайн-PWA.
Игра: https://itsokbear.github.io/block-turn/ · Репозиторий: https://github.com/itsokbear/block-turn

## Новый диалог

Открой этот каталог как проект **BlockTurn**. Достаточно написать:

> Прочитай AGENTS.md и выполни задачу: …

`AGENTS.md` содержит карту кода и ограничения. Актуальные механики, оформление и формат сохранений — в [docs/RULES.md](docs/RULES.md). Историю старого чата переносить не нужно.

## Разработка — только Docker

Команды выполняются из корня проекта. Нужен запущенный Docker Desktop.

```sh
# Запуск / обновление отдельного контейнера на http://localhost:8088
# После изменения кода повторить эту команду.
docker compose up -d --build

# Все unit tests и TypeScript без node_modules на хосте
./scripts/check.sh

# Проверка экспортированной PWA для GitHub Pages
docker build --target build --build-arg NEXT_PUBLIC_BASE_PATH=/block-turn -t local/block-turn:pages-build .

# Логи / остановка
docker compose logs --tail=100
docker compose down
```

Стек: React 19, TypeScript, Vinext/Vite; статический экспорт обслуживает nginx. Точные версии — `package.json` и `package-lock.json`. `next.config.ts` и типы `next` нужны для совместимости Vinext.

## Публикация

После проверок создай коммит в `main` и выполни `./scripts/publish.sh`.
Скрипт использует локальный deploy key из `.deploy/` относительно корня проекта; абсолютные пути не нужны. Если ключа нет, используй собственную авторизацию Git.

GitHub Actions собирает PWA и публикует Pages. Убедись, что [последний запуск](https://github.com/itsokbear/block-turn/actions) завершился успешно именно для отправленного коммита. Сборка автоматически проверяет HTML, base path и все офлайн-ресурсы.

На iPhone: Safari → Поделиться → На экран Домой. Новая версия применяется кнопкой «Обновить» с сохранением партии. Адрес игры и ключи сохранений прежние.

## Локальные материалы

- `.deploy/` — приватный SSH-ключ и known_hosts; не публикуются.
- `.local/design/` — отобранные референсы Бруни и скорлупок; не публикуются.
- `.local/releases/` — архив исходного релиза 1.0.0 с контрольными суммами; не участвует в разработке текущей версии.

Эти каталоги игнорируются Git, TypeScript и Docker. Сборки и зависимости воспроизводятся из исходников; в репозиторий их не добавлять.
