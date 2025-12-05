# Food Ordering API - Quick Test Script
# Save this as test-api.ps1 and run: .\test-api.ps1

$baseUrl = "http://localhost:3001/api"

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "   FOOD ORDERING API - TEST SUITE" -ForegroundColor Magenta
Write-Host "========================================`n" -ForegroundColor Magenta

# Test 1: Login
Write-Host "[TEST 1] Login as Nick Fury (ADMIN)" -ForegroundColor Yellow
$loginBody = @{
    email = "nick.fury@shield.com"
    password = "Password123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
Write-Host "[OK] Login Successful" -ForegroundColor Green
Write-Host "  User: $($response.user.name) ($($response.user.role), $($response.user.country))" -ForegroundColor Cyan
$token = $response.token

# Test 2: Get Profile
Write-Host "`n[TEST 2] Get User Profile" -ForegroundColor Yellow
$profile = Invoke-RestMethod -Uri "$baseUrl/auth/profile" -Headers @{Authorization="Bearer $token"}
Write-Host "[OK] Profile Retrieved" -ForegroundColor Green
Write-Host "  Email: $($profile.email)" -ForegroundColor Cyan

# Test 3: Get All Restaurants
Write-Host "`n[TEST 3] Get All Restaurants (Admin sees all)" -ForegroundColor Yellow
$restaurants = Invoke-RestMethod -Uri "$baseUrl/restaurants" -Headers @{Authorization="Bearer $token"}
Write-Host "[OK] Found $($restaurants.Count) restaurants" -ForegroundColor Green
foreach ($r in $restaurants) {
    Write-Host "  - $($r.name) ($($r.country))" -ForegroundColor Cyan
}

# Test 4: Get Restaurant Menu
Write-Host "`n[TEST 4] Get Restaurant Menu" -ForegroundColor Yellow
$restaurantId = $restaurants[0].id
$menu = Invoke-RestMethod -Uri "$baseUrl/restaurants/$restaurantId/menu" -Headers @{Authorization="Bearer $token"}
Write-Host "[OK] Found $($menu.Count) menu items" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Magenta
Write-Host "   ALL TESTS COMPLETED!" -ForegroundColor Magenta
Write-Host "========================================`n" -ForegroundColor Magenta
