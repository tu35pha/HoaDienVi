@echo on

setlocal

call .\env\Scripts\Activate.ps1

python gradio_demo/app.py --skip download
