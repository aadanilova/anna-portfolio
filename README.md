# anna-portfolio

Сайт-портфолио Анны Даниловой, графического дизайнера и AI-креатора: мерч, упаковка, промопродукция и AI-визуал.

Статический одностраничный сайт (HTML, CSS, vanilla JS) для публикации на GitHub Pages. Сборка не нужна.

## Структура

```
index.html          разметка и тексты
styles.css          стили (светлая + автоматическая тёмная тема)
script.js           появление секций, счётчики, tilt карточек, модалка
assets/favicon.svg
assets/og.jpg       превью для соцсетей 1200×630
assets/ai/          логотипы AI-инструментов (lobehub/icons, MIT)
assets/clients/     логотипы компаний (пока пусто, на сайте текстовые названия)
assets/works/       изображения работ
```

## Публикация на GitHub Pages

1. Settings → Pages.
2. Source: **Deploy from a branch**, Branch: **main**, папка **/ (root)** → Save.
3. Через 1–2 минуты сайт будет по адресу https://hlwktt.github.io/anna-portfolio/

## Логотипы компаний

Положите официальные SVG в `assets/clients/`: `gazprombank.svg`, `chestny-znak.svg`, `stroi-mos.svg`, `f6.svg`, `uniel.svg`.
Как только файл появится, он заменит текстовое название в блоке «Компании, для которых я работала».

## Изображения работ

Обложка проекта: `assets/works/<slug>.jpg`, 1600×1200, JPG до 300 КБ.
Большое фото в модалке: `assets/works/<slug>-01.jpg`, длинная сторона до 1600 px.
Пока файла нет, карточка показывает CSS-плейсхолдер.

| slug | статус |
|---|---|
| gpb-constructor | есть |
| gpb-boardgame | нет изображения |
| gpb-backpacks | нет изображения |
| cz-music-boxes, cz-ornaments | есть |
| moscow-cats | есть |
| f6-candles, f6-bookends | есть |
| uniel-tea | нет изображения |
| ai-fashion | есть |

После добавления `-01.jpg` пропишите `<img>` в `<template class="case-details">` нужной карточки в `index.html`.
