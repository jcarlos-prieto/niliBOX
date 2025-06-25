#!/bin/bash
# Copyright (C) 2025 - Juan Carlos Prieto <nilibox@nilibox.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses>.

echo

if [ $EUID -ne 0 ]; then
    echo "This script must be run as root"
    echo
    exit 1
fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

REM="$DIR/remove.sh"
if [ -f "$REM" ]; then
    REM=/dev/null
fi

echo "#!/bin/bash" > "$REM"
echo "echo" >> "$REM"
echo "if [ \$EUID -ne 0 ]; then" >> "$REM"
echo "    echo This script must be run as root" >> "$REM"
echo "    echo" >> "$REM"
echo "    exit 1" >> "$REM"
echo "fi" >> "$REM"

echo "Finding missing libraries..."
while true; do
    IFS=$'\n'
    LIBS=$(ldd "$DIR/niliBOX" $(find "$DIR" -name "lib*") | grep "not found" | grep -v Qt | awk '{print $1}' | tr ' ' '\n' | sort | uniq)
    NEW=false
    for LIB in $LIBS; do
        if [ -f "$DIR/baklib/$LIB" ]; then
           echo "  Adding $LIB"
           cp "$DIR/baklib/$LIB" "$DIR"
           chown $SUDO_USER:$(id -gn "$SUDO_USER") "$DIR/$LIB"
           NEW=true
         fi
    done
    unset IFS
    if ! $NEW; then
        break
    fi
done
SSL=false
if command -v openssl &> /dev/null; then
    if [ -n "$(openssl version | grep 'OpenSSL 3')" ] || [ -f "$DIR/libssl.so.3" ]; then
        SSL=true
    fi
fi
if ! $SSL; then
    echo "  Adding libssl.so.3"
    cp "$DIR/baklib/libssl.so.3" "$DIR"
    chown $SUDO_USER:$(id -gn "$SUDO_USER") "$DIR/libssl.so.3"
    echo "  Adding libcrypto.so.3"
    cp "$DIR/baklib/libcrypto.so.3" "$DIR"
    chown $SUDO_USER:$(id -gn "$SUDO_USER") "$DIR/libcrypto.so.3"
fi
if [ -z "$LIBS" ]; then
    echo "All libraries found"
else
    echo "WARNING - The following libraries cannot be found:"
    for MISS in $LIBS; do
        echo "  $MISS"
    done
    echo "It is recommened to install them manually"
fi
echo "rm -r /home/$SUDO_USER/.config/nilibox" >> "$REM"
echo "rm -r \"$DIR\"" >> "$REM"

echo "Adding permissions to USB, sound and video"
if grep -q "tty:" /etc/group; then
    if ! groups $SUDO_USER | grep -qw tty; then
        usermod -a -G tty $SUDO_USER
        echo "  $SUDO_USER -> tty"
        echo "gpasswd -d $SUDO_USER tty &> /dev/null" >> "$REM"
    fi
fi
if grep -q "dialout:" /etc/group; then
    if ! groups $SUDO_USER | grep -qw dialout; then
        usermod -a -G dialout $SUDO_USER
        echo "  $SUDO_USER -> dialout"
        echo "gpasswd -d $SUDO_USER dialout &> /dev/null" >> "$REM"
   fi
fi
if grep -q "plugdev:" /etc/group; then
    if ! groups $SUDO_USER | grep -qw plugdev; then
        usermod -a -G plugdev $SUDO_USER
        echo "  $SUDO_USER -> plugdev"
        echo "gpasswd -d $SUDO_USER plugdev &> /dev/null" >> "$REM"
    fi
else
    groupadd plugdev
    usermod -a -G plugdev $SUDO_USER
    echo "  $SUDO_USER -> plugdev"
    echo "gpasswd -d $SUDO_USER plugdev &> /dev/null" >> "$REM"
    echo "groupdel plugdev" >> "$REM"
fi
if grep -q "audio:" /etc/group; then
    if ! groups $SUDO_USER | grep -qw audio; then
        usermod -a -G audio $SUDO_USER
        echo "  $SUDO_USER -> audio"
        echo "gpasswd -d $SUDO_USER audio &> /dev/null" >> "$REM"
    fi
else
    groupadd audio
    usermod -a -G audio $SUDO_USER
    echo "  $SUDO_USER -> audio"
    echo "gpasswd -d $SUDO_USER audio &> /dev/null" >> "$REM"
    echo "groupdel audio" >> "$REM"
fi
if grep -q "video:" /etc/group; then
    if ! groups $SUDO_USER | grep -qw video; then
        usermod -a -G video $SUDO_USER
        echo "  $SUDO_USER -> video"
        echo "gpasswd -d $SUDO_USER video &> /dev/null" >> "$REM"
    fi
else
    groupadd video
    usermod -a -G video $SUDO_USER
    echo "  $SUDO_USER -> video"
    echo "gpasswd -d $SUDO_USER video &> /dev/null" >> "$REM"
    echo "groupdel video" >> "$REM"
fi

echo 'SUBSYSTEM=="usb", MODE="0666", GROUP="plugdev"' > /etc/udev/rules.d/90-niliBOX.rules
echo 'SUBSYSTEM=="sound", MODE="0666",GROUP="audio"' >> /etc/udev/rules.d/90-niliBOX.rules
echo 'SUBSYSTEM=="video4linux", MODE="0666", GROUP="video"' >> /etc/udev/rules.d/90-niliBOX.rules
echo "rm /etc/udev/rules.d/90-niliBOX.rules" >> "$REM"

APP="/home/$SUDO_USER/.local/share/applications"

if command -v brltty &> /dev/null; then
    echo "Disabling BRLtty (incompatible with USB UART devices)"
    while true; do
        BRL=$(which brltty 2> /dev/null)
        if [ -z "$BRL" ]; then
            break
        fi
        mv "$BRL" "$BRL.bak"
        echo "  Renamed $BRL => $BRL.bak"
        echo "mv $BRL.bak $BRL" >> "$REM"
    done
    pkill brltty &> /dev/null
fi

if [ -f "$DIR/libQt6QuickWidgets.so.6" ]; then
    echo "Setting X11 environment"
    echo "export QT_QPA_PLATFORM=xcb" > /etc/profile.d/niliBOX.sh
    chmod +x /etc/profile.d/niliBOX.sh
    echo "rm /etc/profile.d/niliBOX.sh" >> "$REM"

    mkdir -p $APP
    if [ -d $APP ]; then
        echo "Adding application icon"
        DKT=$APP/niliBOX.desktop
        echo [Desktop Entry] > $DKT
        echo Type=Application >> $DKT
        echo Name=niliBOX >> $DKT
        echo Exec=/usr/bin/nilibox >> $DKT
        echo Icon="$DIR/icon.png" >> $DKT
        echo StartupWMClass=com.nilibox.niliBOX >> $DKT
        echo Terminal=false >> $DKT
        chmod +x $DKT
        update-desktop-database $APP
        chown $SUDO_USER:$(id -gn "$SUDO_USER") $APP/*
        echo "rm $DKT" >> "$REM"
    fi

    if command -v gnome-shell &> /dev/null; then
        if [ -z $((ls /usr/share/gnome-shell/extensions 2> /dev/null; ls /home/$SUDO_USER/.local/share/gnome-shell/extensions 2> /dev/null) | grep "appindicator") ]; then
            echo "Installing GNOME icon tray"
            GVER=$(gnome-shell --version)
            GVER=${GVER#GNOME Shell }
            GVER=${GVER#3.}
            if [[ "$GVER" < "16" ]]; then
                WVER="15"
            elif [[ "$GVER" < "32" ]]; then
                WVER="26"
            elif [[ "$GVER" < "34" ]]; then
                WVER="29"
            elif [[ "$GVER" < "45" ]]; then
                WVER="53"
            else
                WVER="59"
            fi
            IND=appindicatorsupport@rgcjonas.gmail.com
            mkdir -p /home/$SUDO_USER/.local/share/gnome-shell/extensions/$IND
            wget -q -O /tmp/appindicator.zip https://extensions.gnome.org/extension-data/appindicatorsupportrgcjonas.gmail.com.v$WVER.shell-extension.zip
            unzip -q /tmp/appindicator.zip -d /home/$SUDO_USER/.local/share/gnome-shell/extensions/$IND
            chown -R $SUDO_USER:$(id -gn "$SUDO_USER") /home/jc/.local/share/gnome-shell/extensions
            BUS_ADDRESS=$(grep -z DBUS_SESSION_BUS_ADDRESS /proc/$(pgrep -n gnome-session)/environ | tr '\0' '\n' | cut -d= -f2-)
            CNF=$(sudo -u $SUDO_USER DBUS_SESSION_BUS_ADDRESS=$BUS_ADDRESS dconf read /org/gnome/shell/enabled-extensions)
            if [ -z "$CNF" ]; then
                CNF=[\'$IND\']
            else
                CNF=$(echo $CNF | sed "s/]/, \'$IND\']/g")
            fi
            sudo -u $SUDO_USER DBUS_SESSION_BUS_ADDRESS=$BUS_ADDRESS dconf write /org/gnome/shell/enabled-extensions "$CNF"
            echo "rm -r /home/$SUDO_USER/.local/share/gnome-shell/extensions/$IND" >> "$REM"
            echo "BUS_ADDRESS=\$(grep -z DBUS_SESSION_BUS_ADDRESS /proc/\$(pgrep -n gnome-session)/environ | tr '\0' '\n' | cut -d= -f2-)" >> "$REM"
            echo "CNF=\$(sudo -u $SUDO_USER DBUS_SESSION_BUS_ADDRESS=\$BUS_ADDRESS dconf read /org/gnome/shell/enabled-extensions)" >> "$REM"
            echo "if [ ! -z \$CNF ]; then" >> "$REM"
            echo "    CNF=\$(echo \$CNF | sed \"s/, '$IND'//g\")" >> "$REM"
            echo "    CNF=\$(echo \$CNF | sed \"s/'$IND', //g\")" >> "$REM"
            echo "    CNF=\$(echo \$CNF | sed \"s/'$IND'//g\")" >> "$REM"
            echo "    if [ \"\$CNF\" = \"[]\" ]; then" >> "$REM"
            echo "        sudo -u \$SUDO_USER DBUS_SESSION_BUS_ADDRESS=$BUS_ADDRESS dconf reset /org/gnome/shell/enabled-extensions" >> "$REM"
            echo "    else" >> "$REM"
            echo "        sudo -u \$SUDO_USER DBUS_SESSION_BUS_ADDRESS=$BUS_ADDRESS dconf write /org/gnome/shell/enabled-extensions \$CNF" >> "$REM"
            echo "    fi" >> "$REM"
            echo "fi" >> "$REM"
        fi
    fi

fi

echo "Creating link /usr/bin/nilibox"
ln -s -f "$DIR/niliBOX" /usr/bin/nilibox
echo "rm /usr/bin/nilibox" >> "$REM"

echo "echo niliBOX has been removed" >> "$REM"
echo "echo" >> "$REM"

chown $SUDO_USER:$(id -gn "$SUDO_USER") "$REM"
chmod +x "$REM"

mkdir -p /home/$SUDO_USER/.config/nilibox/niliBOX
echo Init > /home/$SUDO_USER/.config/nilibox/niliBOX/init
chown $SUDO_USER:$(id -gn "$SUDO_USER") /home/$SUDO_USER/.config/nilibox
chown $SUDO_USER:$(id -gn "$SUDO_USER") /home/$SUDO_USER/.config/nilibox/niliBOX
chown $SUDO_USER:$(id -gn "$SUDO_USER") /home/$SUDO_USER/.config/nilibox/niliBOX/init

echo
echo PLEASE LOG OFF AND LOG ON TO ACTIVATE THE CHANGES
echo
echo To start the application: nilibox
if [ -f "$DIR/libQt6QuickWidgets.so.6" ]; then
    echo "  or find the icon that has been created"
fi
echo For more options: nilibox --help
echo To remove niliBOX: sudo "$DIR/remove.sh"
echo
