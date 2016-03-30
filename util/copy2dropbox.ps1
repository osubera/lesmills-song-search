# PowerShell �o�[�W����2�Ή�
# ���O�C�����[�U�[��Dropbox�t�H���_�ɁA�X�V�t�@�C�����R�s�[����B
#
# ���s���@
# �E�N���b�N���āA�uPowerShell �Ŏ��s�v��I�ԁB

# �R�s�[��p�X��^���Ď��s���ADropbox�t�H���_�ȊO�ɃR�s�[���邱�Ƃ��ł���B
param($dropfolder)

function UseArgOrDrop {
  if($dropfolder -eq $null) { $script:dropfolder = GetDropLesMills }
  if($dropfolder -eq $null) { Write-Error "�R�s�[��w�薳��" -ea Stop }
  if(!$(Test-Path $dropfolder)) { Write-Error "�R�s�[��t�H���_���݂���Ȃ�" -ea Stop }
}

# Dropbox�t�H���_��info.json����擾����B

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
  Write-Error "Dropbox�ݒ�Ȃ��B"
  return($null)
}

function GetDropboxFolder {
  param($infopath)
  if($infopath -eq $null) { return $null }
  $a = cat $infopath | fromJson
  return($($a.personal.path) -replace '=',':' -replace '\\\\','\')
}

# v2��json���ǂ߂Ȃ��̂ŁA���̃P�[�X��p�̊ȈՃp�[�T�[�B
# : ���܂Ƃ߂ĕϊ�����̂ŁA�p�X�� : �܂ŕϊ�����邪�A��Ŗ߂��B
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
      '(:\s*)(\w)','$1"$2' -replace
      '(\w\s*)(,)','$1"$2' -replace
      ':','=' -replace
      ',',';' -replace
      '{','@{' |
      Invoke-Expression
  }
}


# ���s��

UseArgOrDrop
$dest = $(Resolve-Path $dropfolder).Path
$dest + "�ɓ]�����܂��B"

$srcroot = $(Split-Path -parent $(Split-Path -parent $MyInvocation.MyCommand.Path))
$srcroot + "���]�����B"

# json data
$src = $srcroot + "\json"
robocopy $src "$dest\json" /S /XA:RSH /XF .*.* /XD .*.*

# ipad html
$src = $srcroot + "\iPad"
$srcfile="song.ipad.html"
robocopy $src $dest $srcfile /NJH /NJS

