#!/bin/bash

# Global input variables
USERNAME=
FOLDERNAME=
AUTOMATICALLY_COPY=

welcome_message() { \
      echo  "---------------Sam's i3-gaps Setup ---------------"
      echo "This is my script to setup my i3 workstations just how I like them. This script will create a directory in your home folder called i3_setup, if it already exists, then the next highest number will be appended. It will be up to you to copy the files into their appropriate directories for saftey's sake. There will be helper scripts to help copy files and folders to their appropriate locations"  
              
    }

i3_gaps_setup() { \
        #install xutils-dev and other dependencies
        apt install libxcb1-dev libxcb-keysyms1-dev libpango1.0-dev libxcb-util0-dev libxcb-icccm4-dev libyajl-dev libstartup-notification0-dev libxcb-randr0-dev libev-dev libxcb-cursor-dev libxcb-xinerama0-dev libxcb-xkb-dev libxkbcommon-dev libxkbcommon-x11-dev xutils-dev autoconf

        # install xcb-util-xrm from source 
        cd /tmp
        git clone https://github.com/Airblader/xcb-util-xrm
        cd xcb-util-xrm
        git submodule update --init
        ./autogen.sh --prefix=/usr
        make
        sudo make install 
     
        # Clone i3-gaps repo and install 
        mkdir -p ~/i3-gaps_shiz 
        cd ~/i3-gaps_shiz
        git clone https://www.github.com/Airblader/i3 i3-gaps
        cd i3-gaps
        autoreconf --force --install
        mkdir -p build
        cd build
        ../configure --prefix=/usr --sysconfdir=/etc
        make
        sudo make install
        # Copy global config to home. Will be replaced later 
        cp /etc/i3/config ~/.i3/config 
        }

# Copies the given file and renames the new copy with a number appened
copy_rename_file() { \
      path=$(dirname "$1")
      filename=$(basename "$name")
      extension="${filename##*.}"
      filename="${filename%.*}"
      # For print purposes
      oldfile=$filename
      
      if [[ -e $path/$filename.$extension ]] ; then
          i=1
          while [[ -e $path/$filename-$i.$extension ]] ; do
              let i++
          done
          filename=$filename-$i
      fi
    
      newfile=$path/$filename.$extension
      # Copy the given file and rename it accordingly
      cp $path/$oldfile.$extension $newfile
        }

# Takes in a directory name and makes a copy with a different name if it already exists
copy_rename_dir() { \
    name=$1
    dir=$(readlink -f "$name")
    # Whlie ther is a directory with the same name, increment i and apppend to name
    if [[ -d $dir ]] ; then
        i=1
        while [[ -d $dir-$i ]] ; do
            let i++
        done
        dirname=$dir-$i
    fi
    echo "new dirname is : $dirname" 
    mkdir $dirname
    }

# Installs apt programs
apt_install() { 
    # Loop through the csv with the programs to be installed via apt and stores them in ARR
    ARR=()
    INPUT=program_apt_list.csv
    OLDIFS=$IFS
    IFS=,
    [ ! -f $INPUT ] && { echo "$INPUT file not found"; exit 99; }
    n=0;
    while read line
    do
        ARR[$n]=$line
        n=$(($n+1));
    done < $INPUT
    IFS=$OLDIFS

    # Loop that installs apt programs
    n=0;
    for i in "${ARR[@]}"
        do
            echo "Runing apt install ${ARR[$n]}" 
            apt install "${ARR[$n]}"
            n=$(($n+1));
        done
    }

# Clones dotfiles to i3_dotfiles
gitclone() { \
    echo "Cloning i3_setup.git into /home/"$USERNAME"/i3_dotfiles"
    repo="https://github.com/scfite/i3_setup.git"
    localFolder="/home/"$USERNAME"/i3_dotfiles"
    mkdir -p  "$localfolder" 
    git clone "$repo" "$localFolder"
    }

# Gets relevant info from user
get_info() { \
    echo -n "Please enter the username of your system. i.e /home/username/ : "
    read  USERNAME
    echo
    echo -n "Please enter the desired destination folder name for /home/username/foldername : "
    read  FOLDERNAME
    echo
    echo -n "Enter 1 to have this script automatically copy the files and folders to their destination in the system : "
    read  AUTOMATICALLY_COPY
    echo
}

# Greeting message
welcome_message 

#copy_rename_dir "/home/sam/i3_setup" || { clear; exit; }
get_info
echo "USERNAME, FOLDERNAME, AUTOMATICALLY_COPY : "$USERNAME", "$FOLDERNAME", "$AUTOMATICALLY_COPY" "

# Install all apt programs 
#apt_install || { clear; exit; }

# Clone git dotfiles
gitclone 

# Copy and rename file
#copy_rename_file "/home/sam/i3_setup/installer/program_apt_list.csv" || { clear; exit; }


