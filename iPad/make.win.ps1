# PowerShell バージョン2対応
# html, css, js, json のファイルを巨大なhtmlにまとめる。
# iPad対応。
#
# 実行方法
# 右クリックして、「PowerShell で実行」を選ぶ。
# song.ipad.html が作成される。
#
# 次のエラーが出る場合、管理者権限で、PowerShellの実行権限を変更する。
<#
スクリプトの実行がシステムで無効になっているため、
ファイル ...\make.win.ps1 を読み込めません。
詳細については、「get-help about_signing」と入力してヘルプを参照してください。
#>
#
# PS> Set-ExecutionPolicy RemoteSigned
#
# 「powershell 初回実行」で検索すると説明ページが多数見つかる。

# メインが受ける引数
param($dir='../.')

# 作成ファイル
$target = "song.ipad.html"

# 実行時パス
$me = $MyInvocation.MyCommand.Path
cd $(Split-Path -parent $me)

## checker用関数だった
# ConvertFrom-Json はバージョン3以降にしかない。
function fromJson {
  param(
    [Parameter(ValueFromPipeline=$true, Mandatory=$true)]
    [string[]] $json
  )
  begin {
    $x = @()
  }
  process {
    $x += $($json -join "")
  }
  end {
    trap {"ファイル崩れ $x"; break;}
    $x -join "" -replace
      '"\s*:\s*"','"="' -replace
      '"\s*,\s*"','";"' -replace
      '^\s*\[\s*{','@(@{' -replace
      '^\s*\[','@(' -replace
      '\]\s*$',')' -replace
      '\}\s*,\s*\{','},@{' |
      Invoke-Expression
  }
}

function toDo {
  param(
    [Parameter(ValueFromPipeline=$true, Mandatory=$true)]
    $a
  )
  process {
    $fullPath=$a.FullName
    $fileName=$a.Name
    $fileNameWithoutExt=$a.BaseName
    $script:CountFile += 1
    $script:CountFileInFolder += 1
    Write-Debug "$fullPath $fileName $fileNameWithoutExt"
    #echo $CountFile $CountFileInFolder $fullPath $fileName $fileNameWithoutExt
    commaBetweenFiles
    "`"$($fileNameWithoutExt)`": "
    cat $fullPath
  }
}

function beginJSON {
  Write-Debug "beginning JSON"
  "`n/* song data begins */`nvar songData = {"
}

function terminateJSON {
  Write-Debug "terminating JSON"
  "};`n/* song data ends */`n"
}

function beginFolder {
  Write-Debug "beginning folder $folderName at $folderPath"
  commaBetweenFolders
  "`"$($folderName)`": {"
}

function terminateFolder {
  if($CountFolder -gt 0) {
    Write-Debug "terminating previous folder $folderName with $CountFileInFolder files"
    "`n}"
  }
}

function commaBetweenFolders {
   commaBetweenFiles
#  exactly same as Files, if there're no blank folders.  
}

function commaBetweenFiles {
  if($CountFileInFolder -ge 2) {
    ","
  }
}

function the1stHalfHTML {
  param(
    [Parameter(ValueFromPipeline=$true, Mandatory=$true)]
    $file
  )
  cat $file
}

function the2ndHalfHTML {
  param(
    [Parameter(ValueFromPipeline=$true, Mandatory=$true)]
    $file
  )
  cat $file
}

function ListDataFiles {
  param(
    [Parameter(ValueFromPipeline=$true, Mandatory=$true)]
    $a
  )
  process {
    Write-Debug $a
    ls $a -exclude "index-*.txt" |
      ?{! $_.PSIsContainer} |
      ?{$_.Name -match "^\w+\.txt$"} |
      toDo
  }
}

function ListIndexFiles {
  param(
    [Parameter(ValueFromPipeline=$true, Mandatory=$true)]
    $a
  )
  process {
    Write-Debug $a
    ls $a -filter "index-*.txt" |
      ?{! $_.PSIsContainer} |
      toDo
  }
}

function ListDirectories {
  param(
    [Parameter(ValueFromPipeline=$true, Mandatory=$true)]
    $a
  )
  process {
    Write-Debug $a
    ls $a |
      ?{$_.PSIsContainer} |
      ?{$_.Name -match "^\w+$"} |
      ScanDir
  }
}

function ScanDir {
  param(
    [Parameter(ValueFromPipeline=$true, Mandatory=$true)]
    $a
  )
  process {
    Write-Debug $a
    if($CountFolder -gt 0) {
      terminateFolder
    }
    $folderPath=$a.FullName
    $folderName=$a.Name
    if($folderPath -eq $NULL) { # 初回は文字列が来るので .FullName できない
      $aa = Convert-Path $a
      $folderPath = $aa
      $folderName = Split-Path $aa -leaf
    }
    $script:CountFolder += 1
    if($CountFolder -eq 0) {
      Write-Debug "begin at $folderPath"
    }
    else {
      beginFolder
    }
    $script:CountFileInFolder = 0
    ListIndexFiles $folderPath
    ListDataFiles $folderPath
    ListDirectories $folderPath
  }
}

$CountFolder = -1  # root folder should be ignored
$CountFile = 0
$CountFileInFolder = 0


function main {
  param($rootFolder)
  
  the1stHalfHTML "$($rootFolder)\iPad\h1.html"
  beginJSON
  ScanDir "$($rootFolder)\json"
  terminateFolder
  terminateJSON
  the2ndHalfHTML "$($rootFolder)\iPad\h2.html"

  Write-Debug "$CountFile files in $CountFolder folders"
}

main $dir | Out-File -encoding default -filepath $target
# 単純にリダイレクト > すると、unicode with bom になる。
# out-file の -encoding default は、日本語winではsjisになる。
# "shift_jis" を直接指定することはできない。
