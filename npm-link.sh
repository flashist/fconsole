#!/bin/sh
if [ -z "$1" ]
  then
    echo "PASS A 2nd PARAM: link.sh <name-of-a-project-to-copy-into>"
    exit 1
fi

npm run build

CURRENT_FOLDER=$(pwd);
echo "Current folder patch $CURRENT_FOLDER"

CURRENT_PACKAGE_NAME=$(eval 'cut -d "=" -f 2 <<< $(npm run env | grep "npm_package_name")')
echo "Current package name $CURRENT_PACKAGE_NAME"

echo "Adding the current folder is added as a global npm link"
cd dist/
npm link

# Go back to the root of package
cd "../";

# Build of all passed projects
while [ "$1" ]; do
    echo $1

    # Go to the target folder
    cd "${1}"

    npm link "$CURRENT_PACKAGE_NAME"
    echo "Link packakge $CURRENT_PACKAGE_NAME in the target folder"

    cd ${CURRENT_FOLDER}

    shift
done