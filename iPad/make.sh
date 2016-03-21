#!/bin/sh

function toDo {
  #echo $1 >&2
  fullPath=$1
  fileName=${fullPath##*/}
  fileNameWithoutExt=${fileName%.*}
  CountFile=`expr $CountFile + 1`
  CountFileInFolder=`expr $CountFileInFolder + 1`
  #echo $fullPath $fileName $fileNameWithoutExt >&2
  commaBetweenFiles
  echo "\"${fileNameWithoutExt}\": "
  cat $fullPath
}

function beginJSON {
  echo "beginning JSON" >&2
  echo "\n/* song data begins */\nvar songData = {"
}

function terminateJSON {
  echo "terminating JSON" >&2
  echo "};\n/* song data ends */\n"
}

function beginFolder {
  echo "beginning folder $folderName at $folderPath" >&2
  commaBetweenFolders
  echo "\"${folderName}\": {"
}

function terminateFolder {
  if [ $CountFolder -gt 0 ];
    then {
      echo "terminating previous folder $folderName with $CountFileInFolder files" >&2
      echo "\n}"
    }
  fi
}

function commaBetweenFolders {
  commaBetweenFiles
#  exactly same as Files, if there're no blank folders.  
#  and the following is bad, because there're some files located at root.  
#  if [ $CountFolder -ge 2 ];
 #   then echo ","
#  fi
}

function commaBetweenFiles {
  if [ $CountFileInFolder -ge 2 ];
    then echo ","
  fi
}

function the1stHalfHTML {
  cat $1
}

function the2ndHalfHTML {
  cat $1
}

function ListDataFiles {
  local a
  for a in $(find -E $1 -regex ".*/[A-Za-z0-9_]+\.txt" -type f -d 1)
  do
    toDo $a
  done
}

function ListIndexFiles {
  local a
  for a in $(find -E $1 -regex ".*/index-[A-Za-z0-9_]+\.txt" -type f -d 1)
  do
    toDo $a
  done
}

function ListDirectories {
  local a
  for a in $(find -E $1 -regex ".*/[A-Za-z0-9_]+" -type d -d 1)
  do
    #echo $a >&2
    ScanDir $a
  done
}

function ScanDir {
  if [ $CountFolder -gt 0 ];
    then terminateFolder
  fi
  folderPath=$1
  folderName=${folderPath##*/}
  CountFolder=`expr $CountFolder + 1`
  if [ "$CountFolder" = "0" ];
    then echo "begin at $folderPath" >&2
    else  beginFolder
  fi
  CountFileInFolder=0
  ListIndexFiles $folderPath
  ListDataFiles $folderPath
  ListDirectories $folderPath
}

CountFolder=-1  # root folder should be ignored
CountFile=0
CountFileInFolder=0
rootFolder=${1:-"../."}

the1stHalfHTML "${rootFolder}/iPad/h1.html"
beginJSON
ScanDir "${rootFolder}/json"
terminateFolder
terminateJSON
the2ndHalfHTML "${rootFolder}/iPad/h2.html"

echo "$CountFile files in $CountFolder folders" >&2
exit 0