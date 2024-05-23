"""
Author: Jan Valušek (xvalus03)
Description: Script for getting a CRON command for auto-running download_new_registers.py.
"""

from pathlib import Path

current_path = Path(__file__).resolve().parent
venv_path = current_path / 'venv'

if not venv_path.exists():
    print("Please set up the virtual environment as specified in the readme file.")
    exit(1)

venv_activate = venv_path / 'bin' / 'activate'
script_path = current_path / 'download_new_registers.py'

mode = ""
while mode not in ["texts", "both"]:
    mode = input("In what mode do you want to run the script? Enter 'texts' or 'both': ")

crontab_line = f"0 0 * * MON source {venv_activate} && python3 {script_path} {'--mode both' if mode == 'both' else ''}\n"
print(f"Add the following line to your crontab (via 'crontab -e') to run download_new_registers.py in '{mode}' mode "
      "once a week (Sunday to Monday midnight):\n")
print(crontab_line)
