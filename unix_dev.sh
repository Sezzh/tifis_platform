#! /bin/sh

echo "We are going to install some python dependencies for develop this project."
echo "installing virtualenv..."
sudo pip install virtualenv
echo "done.."
echo "Creating a new env dir into this folder where will be the environment"
virtualenv env
echo "enable virtual environment"
. env/bin/activate
echo "Installing all dev python dependencies of this project..."
pip install -r dev_requirements.txt
echo "OK!"
echo "these are the dependencies that have been installed: "
pip freeze
echo "all done."
