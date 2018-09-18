#!/bin/bash

name=/home/sam/i3_setup/installer/program_apt_list.csv
path=$(dirname "$name")
filename=$(basename "$name")
extension="${filename##*.}"
filename="${filename%.*}"
oldfile=$filename

if [[ -e $path/$filename.$extension ]] ; then
    i=2
    while [[ -e $path/$filename-$i.$extension ]] ; do
        let i++
    done
    filename=$filename-$i
fi
target=$path/$filename.$extension

echo $path/$oldfile.$extension $target
cp $path/$oldfile.$extension $target
