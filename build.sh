#!/bin/bash
echo "Python version check:"
python --version
echo "Installing requirements with pre-built wheels..."
pip install --upgrade pip
pip install --only-binary=all -r requirements.txt
