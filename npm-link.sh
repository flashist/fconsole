#!/bin/sh
if [ -z "$1" ]
  then
    echo "PASS A 2nd PARAM: link.sh <name-of-a-project-to-copy-into>"
    exit 1
fi

curPackageName=$(eval 'cut -d "=" -f 2 <<< $(npm run env | grep "npm_package_name")')
echo "Current package name $curPackageName"

echo "Adding the current folder is added as a global npm link"
cd dist/
npm link

# Go back to the root of package
cd "../";
# Go to the target folder
cd "${1}"

echo "Link packakge $curPackageName in the target folder"
npm link "$curPackageName"