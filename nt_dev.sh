#! /bin/sh

echo "We are going to install some python dependencies por develop this project."
echo "installing virtualenv..."
pip install virtualenv
echo "done.."
echo "Creating a new env dir into this folder where will be the environment"
virtualenv env
cho "enable virtual environment"
source env/Scripts/activate
echo "Installing all dev python dependencies of this project..."
pip install -r dev_requirements.txt

echo "these are the dependencies that have been installed: "

pip freeze

echo "all done.."
