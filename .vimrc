"PLUGINS
call plug#begin('~/.vim/plugged')
Plug 'klen/python-mode' "python syntax
Plug 'vim-scripts/c.vim' "c++ syntax
Plug 'ervandew/supertab'  "tab complettion
"Plug 'nightsense/stellarized' "color scheme
Plug 'vim-scripts/vim-auto-save'
call plug#end()

"Autosave
let g:auto_save = 1 " enable AutoSave on Vim startup
let g:auto_save_no_updatetime = 1 " do not change the updatetime option
let g:auto_save_silent = 1  " do not display the auto-save notification

"APPEARANCE
:set guifont=Monaco:h20
:colorscheme elflord
:set background=dark
:syntax on
:set foldmethod=indent
:set norelativenumber
:set number
":highlight LineNr ctermfg=grey

"--------TAB SETTINGS--------------------
filetype plugin indent on
" SHOW EXISTING TAB WITH 4 SPACES WIDTH
set tabstop=4
" WHEN INDENTING WITH '>', USE 4 SPACES WIDTH
set shiftwidth=4
" ON PRESSING TAB, INSERT 4 SPACES
set expandtab
"---------------------------------------

"KEY REMAPS
" compiles .tex and produces a pdf
autocmd BufWritePost *.tex Dispatch! latexmk -pdf main.tex

autocmd Filetype rmd map <F5> :!echo<space>"require(rmarkdown);<space>render('<c-r>%')"<space>\|<space>R<space>--vanilla<enter>

" F9/F10 compile/run default file.
" F11/F12 compile/run alternate file.

 map <F9> :set makeprg=javac\ %<CR>:make<CR>
 map <F10> :!echo %\|awk -F. '{print $1}'\|xargs java<CR>
 map <F11> :set makeprg=javac\ #<CR>:make<CR>
 map <F12> :!echo #\|awk -F. '{print $1}'\|xargs java<CR>

 map! <F9> <Esc>:set makeprg=javac\ %<CR>:make<CR>
 map! <F10> <Esc>:!echo %\|awk -F. '{print $1}'\|xargs java<CR>
 map! <F11> <Esc>set makeprg=javac\ #<CR>:make<CR>
 map! <F12> <Esc>!echo #\|awk -F. '{print $1}'\|xargs java<CR>

"Tip: load a file into the default buffer, and its driver
" into the alternate buffer, then use F9/F12 to build/run.
" Note: # (alternate filename) isn't set until you :next to it!
" Tip2: You can make then run without hitting ENTER to continue. F9-F12

" With these you can cl/cn/cp (quickfix commands) to browse the errors
" after you compile it with :make

 set makeprg=javac\ %
 set errorformat=%A:%f:%l:\ %m,%-Z%p^,%-C%.%#

" If two files are loaded, switch to the alternate file, then back.
" That sets # (the alternate file).
 if argc() == 2
   n
     e #
     endif


if empty(glob('~/.vim/autoload/plug.vim'))
  silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif


