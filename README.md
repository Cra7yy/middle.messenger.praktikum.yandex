# Middle Messenger (Yandex Praktikum)

## Описание
Учебный проект по разработке мессенджера в рамках курса Yandex Praktikum. Цель — реализовать клиентское приложение с базовыми возможностями чата и отработать практики разработки.

## Ссылки
- Деплой [Netlify](https://cerulean-rabanadas-3110ac.netlify.app/)
- Макет в [Figma](https://www.figma.com/design/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=0-1&p=f&t=c69BaGSjjKOTQFZe-0)

## Локальный запуск
Установка зависимостей:
```bash
npm install
```

Запуск статического сервера (localhost:3000):
```bash
npm start
```

Режим разработки с Vite (localhost:5173):
```bash
npm run dev
```

Сборка в папку dist:
```bash
npm run build
```

## Технологии
- HTML5
- SCSS
- JavaScript (ES6+)
- Vite
- ESLint

## Структура проекта
```text
/dist                 # Сборка проекта
/node_modules         # Установленные зависимости
/public               # Публичные файлы
/src                  # Исходные файлы проекта
  /pages              # Страницы приложения
  /main.ts            # Точка входа в приложение
  /type               # Типы TypeScript
.eslint.config.ts     # Конфигурация ESLint
package.json          # Скрипты и зависимости
```
