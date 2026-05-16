# Sync key env vars from local .env to Vercel Production + Preview.
# Usage (from idea_validator/nextjs_space):
#   .\scripts\sync-vercel-env.ps1

$ErrorActionPreference = "Stop"
$envFile = Join-Path $PSScriptRoot "..\.env"
if (-not (Test-Path $envFile)) {
  Write-Error ".env not found at $envFile"
}

function Get-DotEnvValue([string]$name) {
  $line = Get-Content $envFile | Where-Object { $_ -match "^\s*$name\s*=" } | Select-Object -First 1
  if (-not $line) { return $null }
  $value = $line -replace "^\s*$name\s*=\s*", ""
  $value = $value.Trim()
  if ($value.StartsWith('"') -and $value.EndsWith('"')) { $value = $value.Substring(1, $value.Length - 2) }
  if ($value.StartsWith("'") -and $value.EndsWith("'")) { $value = $value.Substring(1, $value.Length - 2) }
  return $value
}

$vars = @("DATABASE_URL", "NEXTAUTH_URL", "NEXTAUTH_SECRET")
$targets = @("production", "preview")

foreach ($name in $vars) {
  $value = Get-DotEnvValue $name
  if ([string]::IsNullOrWhiteSpace($value)) {
    Write-Warning "Skipping $name (empty in .env)"
    continue
  }
  if ($name -eq "DATABASE_URL" -and $value -notmatch "^(postgresql|postgres)://") {
    Write-Warning "DATABASE_URL must start with postgresql:// or postgres://"
  }
  foreach ($target in $targets) {
    Write-Host "Updating $name ($target)..."
    vercel env update $name $target --value $value --yes
  }
}

Write-Host "Done. Redeploy: vercel --prod"
