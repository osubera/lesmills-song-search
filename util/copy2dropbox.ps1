# PowerShell バージョン2対応
# ログインユーザーのDropboxフォルダに、更新ファイルをコピーする。
#
# 実行方法
# 右クリックして、「PowerShell で実行」を選ぶ。

# コピー先パスを与えて実行し、Dropboxフォルダ以外にコピーすることもできる。
param($dropfolder)

function UseArgOrDrop {
  if($dropfolder -eq $null) { $script:dropfolder = GetDropLesMills }
  if($dropfolder -eq $null) { Write-Error "コピー先指定無し" -ea Stop }
  if(!$(Test-Path $dropfolder)) { Write-Error "コピー先フォルダがみつからない" -ea Stop }
}

# Dropboxフォルダはinfo.jsonから取得する。

function GetDropLesMills {
  $x = GetDropboxFolder $(FindDropboxInfo)
  if($x -eq $null) { return $null }
  $x + "\LesMills Song Search"
}

function FindDropboxInfo {
  $a = "Dropbox\info.json"
  $b = @("$env:APPDATA\$a", "$env:LOCALAPPDATA\$a")
  foreach($p in $b) {
    if(Test-Path $p) { return $p }
  }
  Write-Error "Dropbox設定なし。"
  return($null)
}

function GetDropboxFolder {
  param($infopath)
  if($infopath -eq $null) { return $null }
  $a = cat $infopath | fromJson
  return($($a.personal.path) -replace '=',':' -replace '\\\\','\')
}

# v2はjsonが読めないので、このケース専用の簡易パーサー。
# : をまとめて変換するので、パスの : まで変換されるが、後で戻す。
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
      '(:\s*)(\w)','$1"$2' -replace
      '(\w\s*)(,)','$1"$2' -replace
      ':','=' -replace
      ',',';' -replace
      '{','@{' |
      Invoke-Expression
  }
}


# 実行部

UseArgOrDrop
$dest = $(Resolve-Path $dropfolder).Path
$dest + "に転送します。"

$srcroot = $(Split-Path -parent $(Split-Path -parent $MyInvocation.MyCommand.Path))
$srcroot + "が転送元。"

# json data
$src = $srcroot + "\json"
robocopy $src "$dest\json" /S /XA:RSH /XF .*.* /XD .*.*

# ipad html
$src = $srcroot + "\iPad"
$srcfile="song.ipad.html"
robocopy $src $dest $srcfile /NJH /NJS

