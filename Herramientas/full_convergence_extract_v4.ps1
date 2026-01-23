# Full Convergence Extraction Script (Iteration 4 - Markdown Sanity)
# This script reads ALL markdown files and ensures robust spacing for the unified document.

$root = "d:\Digital Lab\Alexandria_Library\ai-engineering-hub-main"
$outputFile = "d:\Digital Lab\Alexandria_Library\ai-engineering-hub_FULL_CONVERGENCE.md"

# Get all MD files
$files = Get-ChildItem -Path $root -Filter *.md -Recurse -Force | Sort-Object FullName

Write-Host "Convergence Pass 4: Processing $($files.Count) markdown files..."

# Header
$header = "# Alexandria Engineering Hub - Full Convergence Document`n`n"
$header += "**Generated:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")`n"
$header += "**Iteration:** Convergence Pass 4 (Markdown Sanity)`n"
$header += "**Total Files:** $($files.Count)`n"
$header += "**Source:** ai-engineering-hub-main`n`n"
$header += "---`n`n"
$header += "## Table of Contents`n`n"

$sb = [System.Text.StringBuilder]::new()
[void]$sb.Append($header)

# TOC
foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($root.Length + 1)
    $folderName = Split-Path $relativePath -Parent
    if ([string]::IsNullOrEmpty($folderName)) { $folderName = "Root" }
    [void]$sb.Append("- **$folderName** / $($file.Name)`n")
}

[void]$sb.Append("`n---`n`n")

# Content
$count = 0
foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($root.Length + 1)
    $folderName = Split-Path $relativePath -Parent
    if ([string]::IsNullOrEmpty($folderName)) { $folderName = "Root" }
    
    [void]$sb.Append("# $folderName`n`n")
    [void]$sb.Append("## $($file.Name)`n`n")
    
    try {
        $reader = [System.IO.StreamReader]::new($file.FullName, [System.Text.Encoding]::UTF8, $true)
        $content = $reader.ReadToEnd()
        $reader.Close()
        
        if ([string]::IsNullOrWhiteSpace($content)) {
            [void]$sb.Append("*[File is empty]*`n")
        }
        else {
            # Ensure the content itself doesn't cause a heading merge
            # and ends with exactly one newline before our separator
            $trimmedContent = $content.Trim()
            [void]$sb.Append($trimmedContent)
            [void]$sb.Append("`n")
        }
    }
    catch {
        [void]$sb.Append("*[Error reading file: $($_.Exception.Message)]*`n")
    }
    
    [void]$sb.Append("`n---`n`n")
    $count++
}

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($outputFile, $sb.ToString(), $utf8NoBom)

Write-Host "Pass 4 Complete. Processed $count files."
