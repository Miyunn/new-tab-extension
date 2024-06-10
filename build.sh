#!/bin/bash

# Change this directory down here for the expected location of the unpacked extension files
unpacked_location=~/Documents/new-tab-build/

# Color variables
red='\033[0;31m'
green='\033[0;32m'
clear='\033[0m'

printf "Building project\n"
npm run build || {
	printf "${red}Build failed!${clear}\n"
	exit 1
}

printf "Copying build files...\n"
cp -r dist/. "$unpacked_location" || {
	printf "${red}Move failed!${clear}\n Please check unpack directory \n"
	exit 1
}

printf "Updating manifest.json...\n\n"
cp -r manifest.json "$unpacked_location" || {
	printf "manifest.json failed to be updated, extension might not run as expected\n"
	exit 1
}

printf ${green}"Build completed! ${clear}\n"
