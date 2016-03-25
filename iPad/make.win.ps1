# PowerShell �o�[�W����2�Ή�
# html, css, js, json �̃t�@�C���������html�ɂ܂Ƃ߂�B
# iPad�Ή��B
#
# ���s���@
# �E�N���b�N���āA�uPowerShell �Ŏ��s�v��I�ԁB
# song.ipad.html ���쐬�����B
#
# ���̃G���[���o��ꍇ�A�Ǘ��Ҍ����ŁAPowerShell�̎��s������ύX����B
<#
�X�N���v�g�̎��s���V�X�e���Ŗ����ɂȂ��Ă��邽�߁A
�t�@�C�� ...\make.win.ps1 ��ǂݍ��߂܂���B
�ڍׂɂ��ẮA�uget-help about_signing�v�Ɠ��͂��ăw���v���Q�Ƃ��Ă��������B
#>
#
# PS> Set-ExecutionPolicy RemoteSigned
#
# �upowershell ������s�v�Ō�������Ɛ����y�[�W������������B

# ���C�����󂯂����
param($dir='../.')

# �쐬�t�@�C��
$target = "song.ipad.html"

# ���s���p�X
$me = $MyInvocation.MyCommand.Path
cd $(Split-Path -parent $me)

## checker�p�֐�������
# ConvertFrom-Json �̓o�[�W����3�ȍ~�ɂ����Ȃ��B
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
    trap {"�t�@�C������ $x"; break;}
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
    if($folderPath -eq $NULL) { # ����͕����񂪗���̂� .FullName �ł��Ȃ�
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
# �P���Ƀ��_�C���N�g > ����ƁAunicode with bom �ɂȂ�B
# out-file �� -encoding default �́A���{��win�ł�sjis�ɂȂ�B
# "shift_jis" �𒼐ڎw�肷�邱�Ƃ͂ł��Ȃ��B
