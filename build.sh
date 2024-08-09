#!/bin/bash

# Change this directory down here for the expected location of the unpacked extension files
unpacked_location=~/Documents/new-tab-build

red='\033[0;31m'
green='\033[0;32m'
clear='\033[0m'

rm -r "$unpacked_location" || {
    printf "${red}Failed to remove older build files${clear}\n"
}

printf "Making new directories for build files....\n"
mkdir -p "$unpacked_location" || {
    printf "${red}Failed to make build dir${clear}\n"
    exit 1
}

mkdir "$unpacked_location/chrome" || {
    printf "${red}Failed to make Chrome dir${clear}\n"
    exit 1
}

mkdir "$unpacked_location/firefox" || {
    printf "${red}Failed to make Firefox dir${clear}\n"
    exit 1
}

printf "Building project\n"
npm run build || {
    printf "${red}Build failed!${clear}\n"
    exit 1
}

printf "Copying build files...\n"
cp -r dist/. "$unpacked_location/chrome" || {
    printf "${red}Move failed for Chrome!${clear}\n Please check unpack directory \n"
    exit 1
}
cp -r dist/. "$unpacked_location/firefox" || {
    printf "${red}Move failed for Firefox!${clear}\n Please check unpack directory \n"
    exit 1
}

printf "Adding manifest.json...\n"
cp manifest/chrome.json "$unpacked_location/chrome/manifest.json" || {
    printf "${red}Failed to add manifest for Chrome, please check or manually add the manifest file${clear}\n"
    exit 1
}

cp manifest/firefox.json "$unpacked_location/firefox/manifest.json" || {
    printf "${red}Failed to copy and rename firefox-manifest.json!${clear}\n"
    exit 1
}

printf "${green}Build completed!${clear}\n"

read -r -p "zip files for production? (Y/n) : " zip 

if [[ $zip =~ ^[Yy]$ ]]; then
    printf "\nzipping...\n"
    
    cd "$unpacked_location/chrome" || {
        printf "${red}Failed to navigate to Chrome directory${clear}\n"
        exit 1
    }
    zip -r ../new-tab-chrome.zip . || {
        printf "${red}Failed to zip Chrome files!${clear}\n"
        exit 1
    }
    
    cd "$unpacked_location/firefox" || {
        printf "${red}Failed to navigate to Firefox directory${clear}\n"
        exit 1
    }
    zip -r ../new-tab-firefox.zip . || {
        printf "${red}Failed to zip Firefox files!${clear}\n"
        exit 1
    }
    
    printf "${green}Zipping completed!${clear}\n"
else
    printf "Skipping zipping files.\n"
fi

