#!/usr/bin/env pwsh
# Simple JSON Generator for OC Gallery
# Scans the images folder structure and generates JSON files

param(
    [string]$Action = "generate",
    [string]$Character = ""
)

# Configuration
$ValidCharacters = @("thea", "darla", "caelielle", "misc")
$ValidSections = @("sfw", "nsfw", "ref")
$ValidExtensions = @(".jpg", ".jpeg", ".png", ".gif", ".webp")

# Color functions
function Write-Success { param($Message) Write-Host $Message -ForegroundColor Green }
function Write-Info { param($Message) Write-Host $Message -ForegroundColor Cyan }
function Write-Error { param($Message) Write-Host $Message -ForegroundColor Red }

function New-Title {
    param([string]$FileName)
    
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($FileName)
    
    # Convert underscores/hyphens to spaces and title case
    $title = $baseName -replace '[_\-]', ' ' -replace '\s+', ' '
    
    # Convert to title case
    $title = (Get-Culture).TextInfo.ToTitleCase($title.ToLower())
    
    return $title
}

function New-JSONFiles {
    param([string]$Character = "")
    
    Write-Info "Generating JSON files from images..."
    
    $characters = if ($Character) { @($Character) } else { $ValidCharacters }
    
    foreach ($char in $characters) {
        $charPath = "images\$char"
        if (-not (Test-Path $charPath)) {
            Write-Info "No images folder found for character: $char"
            continue
        }
        
        $jsonData = @{}
        
        foreach ($section in $ValidSections) {
            $sectionPath = "$charPath\$section"
            $jsonData[$section] = @()
            
            if (Test-Path $sectionPath) {
                $images = Get-ChildItem -Path $sectionPath -File | Where-Object { 
                    $ValidExtensions -contains $_.Extension.ToLower() 
                } | Sort-Object Name
                
                foreach ($image in $images) {
                    $title = New-Title $image.Name
                    $description = "$title artwork"
                    
                    $entry = @{
                        title = $title
                        src = "./images/$char/$section/$($image.Name)"
                        desc = $description
                    }
                    
                    $jsonData[$section] += $entry
                }
                
                Write-Info "  Found $($images.Count) images in $char/$section"
            }
        }
        
        # Save JSON file
        $jsonPath = "data\$char.json"
        $jsonOutput = $jsonData | ConvertTo-Json -Depth 3
        
        # Ensure data directory exists
        if (-not (Test-Path "data")) {
            New-Item -ItemType Directory -Path "data" -Force | Out-Null
        }
        
        try {
            $jsonOutput | Out-File -FilePath $jsonPath -Encoding UTF8 -Force
            Write-Success "Generated: $jsonPath"
        } catch {
            Write-Error "Failed to generate $jsonPath - $($_.Exception.Message)"
        }
    }
    
    Write-Success "JSON generation complete!"
}

# Main execution
if ($Action -eq "generate") {
    New-JSONFiles -Character $Character
} else {
    Write-Error "Unknown action: $Action. Use 'generate' to create JSON files."
}
