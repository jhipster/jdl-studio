#!/bin/bash

if [ -z "$(git status --porcelain)" ]; then
    echo ">>> Working directory is clean"
    TMP_LOC=/tmp/jdl-studio
    DEPLOY_BRANCH=gh-pages
    SRC_BRANCH=src

    /bin/rm -rf build || exit
    /bin/rm -rf $TMP_LOC || exit

    echo ">> Building app"
    npm run build || exit

    echo ">> Move build assets to temp folder"
    mkdir --parents $TMP_LOC || exit
    mv build/* $TMP_LOC || exit

    echo ">> Checkout and clean $DEPLOY_BRANCH branch"
    git fetch && git checkout $DEPLOY_BRANCH || exit
    find -mindepth 1 -depth -print0 | grep -vEzZ '(.github(/|$)|node_modules(/|$)|.tmp(/|$)|.git(/|$)|/\.gitignore$|/\LICENSE.txt$|/\README.md$)' | xargs -0 rm -rvf || exit

    echo ">> Move app form temp & publish to GitHub"
    mv $TMP_LOC/* . || exit

    now=$(date)
    git config user.name github-actions || exit
    git config user.email github-actions@github.com || exit
    git add --all || exit
    git commit -am "Updated app on $now" || exit
    git push origin $DEPLOY_BRANCH --force || exit

    echo ">> $now: Published changes to GitHub"

    git checkout $SRC_BRANCH
else
    echo ">> Working directory is not clean. Commit changes and try again!"
    exit
fi
