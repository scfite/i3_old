#!/bin/bash
yes | cp -rf /home/sam/.config /home/sam/i3_setup/ 
yes | cp -rf /home/sam/guides /home/sam/i3_setup/ 
yes | cp -rf /home/sam/.profile /home/sam/i3_setup/ 
yes | cp -rf /home/sam/.bashrc /home/sam/i3_setup/ 
yes | cp -rf /home/sam/.bash_aliases /home/sam/i3_setup/ 
yes | cp -rf /home/sam/.bash_ps1 /home/sam/i3_setup/ 
yes | cp -rf /home/sam/.vimrc /home/sam/i3_setup/ 
yes | cp -rf /home/sam/.xprofile /home/sam/i3_setup/ 
yes | cp -rf /home/sam/.Xresources /home/sam/i3_setup/ 

cd /home/sam/i3_setup
git add . 
git commit . -m "avoid the prompt" 
git push -u origin master
