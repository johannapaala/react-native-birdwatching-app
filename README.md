
# Birdwatching App

## Kuvaus
Mobiilisovellus lintujen bongaukseen. Sovelluksella käyttäjä voi lisätä
bongaamansa lintulajin, kirjata lisätietoja sekä liittää
havaintoon kuvan. Sovellus tallentaa bongauksen ajankohdan ja sijainnin
automaattisesti.

Kaikki bongaukset näkyvät päänäkymässä aakkosjärjestyksessä, ja yksittäistä
havaintoa painamalla käyttäjä näkee kaikki tallennetut tiedot, mukaan lukien
sijainnin ja kuvan.

## Tekninen toteutus
- Tilanhallinta toteutettu Context API:n avulla
- SQLite-tietokanta havaintojen tallentamiseen
- Bottom navigation React Native Paperilla
- Kameratoiminnallisuus toteutettu Expo Cameralla
- Sijainnin haku ja reverse geocoding Expo Location -kirjastolla

## Teknologiat ja työkalut
- React Native
- Expo
- TypeScript
- SQLite (expo-sqlite)
- React Native Paper
- Expo Camera
- Expo Location
