@echo off
taskkill /f /t /fi "WINDOWTITLE eq npm"
cd\
D:
cd "gitee/topicGallery"
npm run build
@cmd.exe