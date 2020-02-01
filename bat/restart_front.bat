@echo off
taskkill /f /t /fi "WINDOWTITLE eq npm"
taskkill /f /t /fi "WINDOWTITLE eq gulp"
cd\
D:
cd "gitee/topicGallery"
npm run dev
@cmd.exe