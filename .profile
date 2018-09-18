# ~/.profile: executed by the command interpreter for login shells.
# This file is not read by bash(1), if ~/.bash_profile or ~/.bash_login
# exists.
# see /usr/share/doc/bash/examples/startup-files for examples.
# the files are located in the bash-doc package.

# the default umask is set in /etc/profile; for setting the umask
# for ssh logins, install and configure the libpam-umask package.
#umask 022

# if running bash
if [ -n "$BASH_VERSION" ]; then
    # include .bashrc if it exists
    if [ -f "$HOME/.bashrc" ]; then
	. "$HOME/.bashrc"
    fi
fi

# set PATH so it includes user's private bin directories
PATH=$PATH:$HOME/bin:$HOME/.local/bin:~/DrMemory-Linux-2.0.0-RC2/bin:~/builds/idea-IC-182.3911.36/bin


#variables for i3 config
export TERMINAL="urxvt"
export BROWSER="firefox"
export PATH="$PATH:$HOME/.scripts"
export EDITOR="vim"
export READER="evince"
export RANGER_LOAD_DEFAULT_RC="FALSE"
