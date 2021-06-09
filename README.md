# bionic-wallpaper-hotpatch

This extension (aims to) fixes the Ubuntu 18.04 LTS GNOME Shell bug triggered when changing wallpapers

Patches Ubuntu 18.04 LTS to fix GNOME Shell bug [#501](https://gitlab.gnome.org/GNOME/gnome-shell/-/issues/501) and Ubuntu bug [#1787822](https://bugs.launchpad.net/ubuntu/+source/gnome-shell/+bug/1787822) caused by run_dispose being run on background object. This hot patch updates Background object and BackgroundManager to fix this unwanted behaivour. This extension should only be used on GNOME 3.33.2 or below.
