# PowerShell script to properly replace Render URLs with localhost

$renderUrl = "https://mut-environmental-health-wil-backend.onrender.com"
$localhostUrl = "http://localhost:8080"

# Get all TypeScript files in src directory
$files = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse

$totalFixed = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix malformed comments from previous script
    $content = $content -replace "// $renderUrl\s*\n\s*'$localhostUrl", "$localhostUrl"
    $content = $content -replace "// $renderUrl\s*\n\s*`"$localhostUrl", "$localhostUrl"
    $content = $content -replace "// $renderUrl\s*\n", ""
    
    # Replace any remaining Render URLs with localhost
    $content = $content -replace [regex]::Escape($renderUrl), $localhostUrl
    
    # If content changed, write it back
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)"
        $totalFixed++
    }
}

Write-Host "`nFixed $totalFixed files!"
Write-Host "All Render URLs have been replaced with localhost:8080"
