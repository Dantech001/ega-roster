@echo off
setlocal

rem Commit, push and publish the site in one step.
rem   deploy                      -> commits as "Update site"
rem   deploy "new player: X"      -> uses your own message

set "MSG=%~1"
if "%MSG%"=="" set "MSG=Update site"

cd /d "%~dp0"

echo.
echo === committing ===
git add -A
git diff --cached --quiet && (
  echo   nothing to commit, deploying current files
) || (
  git commit -m "%MSG%" || goto :failed
  echo   committed: %MSG%
)

echo.
echo === pushing to GitHub ===
git push origin main || echo   push failed - continuing to deploy anyway

echo.
echo === deploying to Netlify ===
call netlify deploy --prod --dir . || goto :failed

echo.
echo Done: https://eliteglobalathletes.com
goto :eof

:failed
echo.
echo DEPLOY FAILED - see the messages above.
exit /b 1
