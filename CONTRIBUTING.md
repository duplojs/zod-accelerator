# Comment contribuer

Nous sommes heureux de recevoir des contributions à ce projet open source ! Si vous souhaitez contribuer, veuillez suivre les étapes ci-dessous :

## Signaler des bugs

Si vous rencontrez un bug dans le projet, veuillez créer un rapport de bug en suivant [ce modèle](https://github.com/duplojs/duplojs-zod-accelerator/blob/develop/.github/ISSUE_TEMPLATE/signalement-de-bug.md). Assurez-vous de fournir suffisamment d'informations pour reproduire le bug et de faire une recherche pour vous assurer qu'il n'a pas déjà été signalé.

## Demander une fonctionnalité

Si vous souhaitez proposer une nouvelle fonctionnalité ou une modification de fonctionnalité existante, veuillez créer une demande de fonctionnalité en suivant [ce modèle](https://github.com/duplojs/duplojs-zod-accelerator/blob/develop/.github/ISSUE_TEMPLATE/demande-de-fonctionnalit%C3%A9.md). Assurez-vous de fournir suffisamment d'informations pour comprendre l'intérêt de la fonctionnalité proposée et de faire une recherche pour vous assurer qu'elle n'a pas déjà été demandée.

## Contribuer au code

Si vous souhaitez contribuer au code du projet, voici les étapes à suivre :

1. Forkez le dépôt
2. Créez votre branche de fonctionnalité (git checkout -b my-new-feature)
3. Commitez vos changements (git commit -am 'Add some feature')
4. Publiez votre branche (git push origin my-new-feature)
5. Créez une nouvelle Pull Request

## Fonctionnement des branches

`main` ==> code stable, testé, validé et publier sur npm.

`develop` ==> créée à partir de main, c'est sur cette branche que nous apportons des modifications et que nous les testons.

`break/nom` ==> créée à partir de develop, elle apporte un changement majeur.

`feat/nom` ==> créée à partir de develop, elle implémente une nouvelle fonctionnalité.

`fix/nom` ==> créée à partir de develop, elle corrige du code.

`github/nom` ==> créée à partir de develop, elle fait des modification de fichiers dans le dossier ".github".

`md/nom` ==> créée à partir de develop, elle fait des modifications de fichiers ayant l'extension ".md".

## Fonctionnement des pull requests

En direction de la branche develop:

`[break] Titre` ==> pull request contenant des nouvelles fonctionnalités.

`[feat] Titre` ==> pull request contenant des nouvelles fonctionnalités.

`[fix] Titre` ==> pull request contenant des correction du code, qu'elle soit d'ordre de bug ou d'amélioration du code.

`[github] Titre` ==> pull request contenant des modification d'un fichier dans le dossier ".github".

`[md] Titre` ==> pull request contenant des modification d'un fichier ayant l'extension ".md".

En direction de la branche main:

`[publish]` ==> pull request contenant toutes les dernières modifications apportées à la branche develop pour en publier le contenu sur la branche main et aussi sur npm.

`[update] Titre` ==> pull request pour mettre à jour la branche main par rapport à develop.

Les pull requests ont par défaut le label "wip". Retirez le si vous voulez qu'elles soient vérifiées puis validées.

Assurez-vous de respecter le style de code existant et de documenter vos modifications si nécessaire. N'oubliez pas de tester vos modifications avant de les soumettre.

:warning: Faites attention de bien faire correspondre le nom de la PR et celui du commit du squash and merge. :warning:

## Règles de contribution

En soumettant une contribution à ce projet, vous acceptez de rendre votre travail disponible sous la licence du projet.

Veuillez également vous assurer que votre contribution respecte les règles suivantes :

- Ne pas violer les droits d'auteur ni les marques déposées
- Ne pas inclure de contenu offensant ou discriminatoire
- Ne pas inclure de contenu promotionnel non sollicité

Les contributions qui ne respectent pas ces règles peuvent être refusées.

## Remerciements

Nous remercions tous les contributeurs pour leur aide à améliorer ce projet open source !
