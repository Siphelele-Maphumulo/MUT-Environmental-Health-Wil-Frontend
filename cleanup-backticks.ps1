# PowerShell script to fix double backticks

# Get all TypeScript files in src directory
$files = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse

$totalFixed = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix double backticks
    $content = $content -replace '``', '`'
    
    # If content changed, write it back
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Fixed: $($file.FullName)"
        $totalFixed++
    }
}

Write-Host "`nFixed $totalFixed files!"
Write-Host "All double backticks have been corrected"
