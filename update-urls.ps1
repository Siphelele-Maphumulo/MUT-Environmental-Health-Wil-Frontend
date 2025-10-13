# PowerShell script to comment out Render URLs and replace with localhost

$renderUrl = "https://mut-environmental-health-wil-backend.onrender.com"
$localhostUrl = "http://localhost:8080"

# Get all TypeScript files in src directory
$files = Get-ChildItem -Path "src" -Filter "*.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Replace Render URLs with localhost, keeping the original as a comment
    $content = $content -replace "([^/])$renderUrl", "`$1// $renderUrl`n`$1$localhostUrl"
    
    # If content changed, write it back
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nURL replacement complete!"
