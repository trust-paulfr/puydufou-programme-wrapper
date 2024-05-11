# Puy du fou - Wrapper Programme 

## Description

Ce projet est un wrapper de l'application mobile du Puy du Fou. Il permet de récupérer les informations des spectacles, des restaurants, des hôtels et des boutiques du parc. Très spécifique, il est conçu pour indiquer l'état d'ouverture des spectacles, des restaurants, des hôtels et des boutiques du parc.

Il permet d'avoir la jauge de remplissage des spectacles ainsi qu'un "state" pour indiquer si le spectacle est complet, en cours ou à venir.

## Données 

Pour récupérer les données, nous utilisons différentes sources :
- l'api mobile du Puy du Fou (https://api.mobile.puydufou.com/) -> Pour le programme en JSON 
- le cdn de l'app mobile du Puy du Fou (https://cdn.mobile.puydufou.com/) -> Pour la Database en SQLite (Convertir les id des spectacles en nom...)
- l'api mobile, spécifiquement la partie "pivot" (https://api.mobile.puydufou.com/pivot/pdf/wezit?lang=fr) -> Pour intervertir des ID pour le MQTT

- Le serveur MQTT de l'app mobile du Puy du fou (wss://notifications.puydufou.com/mqtt) -> Pour récupérer les informations en temps réel (jauge de remplissage principalement)

## Utilisabilité

Attention ce projet n'est pas donné utilisable, les données utilisés ou encore les api utilisés sont spécifiques au Puy du Fou. Ces données sont propriété du Puy du Fou

C'est donc pour cela qu'il n'est donné avec aucune garantie d'utilisation, de fonctionnement ou de mise à jour.
De plus, aucun fichier sqlite appartenant au Puy du Fou n'est fourni, il est donc nécessaire de le récupérer soit même via l'api 

Le client ID, le username ou encore password du serveur MQTT ne sont pas fournis, il est donc nécessaire de les récupérer soit même, il n'est à aucun moment expliqué comment les récupérer.

## Installation

Pour installer le projet, il suffit de cloner le projet et de lancer la commande `npm install` pour installer les dépendances.

## Utilisation

Pour lancer le projet, il suffit de lancer la commande `npm start` pour lancer le serveur.

## Exemple d'utilisation

les fichiers example_mqtt.js et example_webserver.js sont des exemples d'utilisation des différentes parties du projet.

## Exemple WebServer 

```json
    {
        "wzid": "wzobj:scenode_5AOAE8eEY",
        "duree": 28,
        "heures": [
            {
                "debut": "1000",
                "debut_timestamp": 1715414400000,
                "fin": ""
            },
            {
                "debut": "1200",
                "debut_timestamp": 1715421600000,
                "fin": ""
            },
            {
                "debut": "1430",
                "debut_timestamp": 1715430600000,
                "fin": ""
            },
            {
                "debut": "1600",
                "debut_timestamp": 1715436000000,
                "fin": ""
            },
            {
                "debut": "1730",
                "debut_timestamp": 1715441400000,
                "fin": ""
            },
            {
                "debut": "1900",
                "debut_timestamp": 1715446800000,
                "fin": ""
            }
        ],
        "title": "Le Mime et l’Étoile",
        "subject": "Action ! Aux débuts du cinéma, assistez à un tournage en noir et blanc où le réalisateur va chercher à rendre voix et couleurs à ses personnages.",
        "description": "Nous sommes en 1914 et les visiteurs sont invités à assister, en silence, au tournage d’un tout nouveau film mettant en scène Garance, l’étoile montante du 7ème art, et Mimoza, le jeune mime rêveur. Sur le plateau, le réalisateur Gérard Bideau espère réaliser son rêve… Il est en effet convaincu que seul un amour sincère pourra offrir au cinéma muet et noir et blanc, une couleur et un son.",
        "pdfid": "2225962953460071741",
        "state": 2,
        "affluence": 50
    }
```

### Type de state 
- 0: Aucun spectacle pendant 1h
- 1: Spectacle dans les prochaines 60 minutes
- 2: Spectacle en court de remplissage, début dans moins de 30 minutes
- 3: Spectacle complet ou en cours

## License

Ce projet est sous licence MIT
