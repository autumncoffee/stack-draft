#!/bin/bash -e

#####################
# To update Chromium:
# 1. go to https://omahaproxy.appspot.com/ and find desired branch_base_position
# 2. use https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=${Mac|Linux_x64}/${branch_base_position}/
# 3. decrement branch_base_position by 1 until something is found
#####################

cwd=`dirname "${BASH_SOURCE[0]}"`
os=`uname -s`
base_url='https://autumncoffee.com/misc/chrome/812852'
driver_filename='chromedriver_linux64.zip'
chrome_filename='chrome-linux.zip'
driver_bin='chromedriver_linux64/chromedriver'
chrome_bin='chrome-linux/chrome-wrapper'


if [ "${os}" == 'Darwin' ]; then
    driver_filename='chromedriver_mac64.zip'
    chrome_filename='chrome-mac.zip'
    driver_bin='chromedriver_mac64/chromedriver'
    chrome_bin='chrome-mac/Chromium.app/Contents/MacOS/Chromium'
fi

dir="${cwd}/webdriver"

mkdir -p "${dir}"
cd "${dir}"

for filename in "${driver_filename}" "${chrome_filename}"
do
    if [ ! -e "${filename}" ]; then
        curl "${base_url}/${filename}" -vLo "${filename}"
        unzip "${filename}"
    fi
done

chrome_file="./chrome"
driver_path="./chromedriver"

if [ ! -e "${chrome_file}" ]; then
    ln -s "${chrome_bin}" "${chrome_file}"
fi

if [ ! -e "${driver_path}" ]; then
    ln -s "${driver_bin}" "${driver_path}"
fi
