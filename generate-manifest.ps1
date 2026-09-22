$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$holudDir = Join-Path $root "media\holud"
$weddingDir = Join-Path $root "media\wedding"
$videoDir = Join-Path $root "media\videos"

function JSQuote($s) {
  return '"' + ($s -replace '\\','\\' -replace '"','\"') + '"'
}
$holud = @(Get-ChildItem $holudDir -File -Include *.jpg,*.jpeg,*.JPG,*.JPEG | Sort-Object Name | ForEach-Object { JSQuote $_.Name })
$wedding = @(Get-ChildItem $weddingDir -File -Include *.jpg,*.jpeg,*.JPG,*.JPEG | Sort-Object Name | ForEach-Object { JSQuote $_.Name })
$videos = @(Get-ChildItem $videoDir -File -Include *.mp4,*.MP4 | Sort-Object Name | ForEach-Object { JSQuote $_.Name })

$out = @()
$out += "const MEDIA = {"
$out += "  holud: ["; $out += ($holud -join ",`n    "); $out += "],"
$out += "  wedding: ["; $out += ($wedding -join ",`n    "); $out += "],"
$out += "  videos: ["; $out += ($videos -join ",`n    "); $out += "]"
$out += "};"
Set-Content (Join-Path $root "media-manifest.js") ($out -join "`n") -Encoding UTF8
Write-Host "Manifest generated. Holud: $($holud.Count), Wedding: $($wedding.Count), Videos: $($videos.Count)"
