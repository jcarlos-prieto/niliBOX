/*
 * Copyright (C) 2025 - Juan Carlos Prieto <nilibox@nilibox.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses>.
 */

package com.nilibox.niliBOX;


import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbConfiguration;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbManager;
import android.media.AudioDeviceInfo;
import android.media.AudioFormat;
import android.media.AudioManager;
import com.hoho.android.usbserial.driver.UsbSerialDriver;
import com.hoho.android.usbserial.driver.UsbSerialPort;
import com.hoho.android.usbserial.driver.UsbSerialProber;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;


public class alib
{
    private static String ACTION_USB_PERMISSION = "com.android.example.USB_PERMISSION";
    Context m_context;
    UsbManager m_usbmanager;
    AudioManager m_audiomanager;
    Object m_lock;
    HashMap<Integer, UsbDeviceConnection> m_connections = new HashMap<Integer, UsbDeviceConnection>();
    HashMap<String, UsbSerialPort> m_serialports = new HashMap<String, UsbSerialPort>();


    alib(Context context)
    {
        m_context = context;
        m_usbmanager = (UsbManager)m_context.getSystemService(Context.USB_SERVICE);
        m_audiomanager = (AudioManager)m_context.getSystemService(Context.AUDIO_SERVICE);
        m_lock = new Object();
    }
   
   
    public Object[] usb_getDeviceList()
    {
        return m_usbmanager.getDeviceList().values().toArray();
    }
   
   
    public Object usb_getConfigDescriptor(int vendorId, int productId, int index)
    {
        UsbDevice device = findUsbDevice(vendorId, productId);

        if (device == null)
            return null;
   
        if (index != 255)
           return device.getConfiguration(index);
      
        if (device.getConfigurationCount() == 1)
           return device.getConfiguration(0);
         
        for (int i = 0; i < device.getConfigurationCount(); i++) {
            UsbConfiguration config = device.getConfiguration(i);
            if (device.getInterfaceCount() != config.getInterfaceCount())
                continue;
            boolean eq = true;
            for (int j = 0; j < device.getInterfaceCount(); j++) {
                if (device.getInterface(j).getEndpoint(0).getAddress() != config.getInterface(j).getEndpoint(0).getAddress())
                    eq = false;
            }
            if (eq)
                return config;
        }
   
        return null;
    }
   
   
    public String usb_getStringDescriptor(int vendorId, int productId, int index)
    {
        UsbDevice device = findUsbDevice(vendorId, productId);

        if (device == null)
            return "";
         
        if (index == 1)
            return device.getManufacturerName();
        else if (index == 2)
            return device.getProductName();
        else if (index == 3)
            return device.getSerialNumber();
        else
            return "";
    }
   
   
    public int usb_openDevice(int address)
    {
        UsbDevice device = findUsbDevicebyAddress(address);
      
        if (device == null)
            return -1;

        PendingIntent pendint = PendingIntent.getBroadcast(m_context, 0, new Intent(ACTION_USB_PERMISSION), PendingIntent.FLAG_IMMUTABLE);
        IntentFilter filter = new IntentFilter(ACTION_USB_PERMISSION);
        UsbReceiver usbReceiver = new UsbReceiver();
        m_context.registerReceiver(usbReceiver, filter);
        m_usbmanager.requestPermission(device, pendint);
      
        try {
            synchronized(m_lock) {
                m_lock.wait();
            }
        } catch (InterruptedException ex) {
            return -1;
        }

        UsbDeviceConnection connection = m_usbmanager.openDevice(device);
      
        if (connection == null)
            return -1;
      
        m_connections.put(address, connection);
        return connection.getFileDescriptor();
    }
   
   
    public void usb_closeDevice(int address)
    {
        if (m_connections.containsKey(address)) {
            UsbDeviceConnection connection = m_connections.get(address);
            connection.close();
            m_connections.remove(address);
        }
    }
   
   
    private UsbDevice findUsbDevice(int vendorId, int productId)
    {
        HashMap<String, UsbDevice> devicelist = m_usbmanager.getDeviceList();

        for (UsbDevice device : devicelist.values())
            if (device.getVendorId() == vendorId && device.getProductId() == productId)
                return device;
      
        return null;
    }
   

    private UsbDevice findUsbDevicebyAddress(int address)
    {
        HashMap<String, UsbDevice> devicelist = m_usbmanager.getDeviceList();

        for (UsbDevice device : devicelist.values())
            if ((0xff & device.getDeviceId()) == address)
                return device;
      
        return null;
    }
   

    public void serial_init()
    {
        m_serialports.clear();
        String key;
        List<UsbSerialDriver> drivers = UsbSerialProber.getDefaultProber().findAllDrivers(m_usbmanager);

        for (UsbSerialDriver driver : drivers) {
            int vid = driver.getDevice().getVendorId();
            int pid = driver.getDevice().getProductId();

            List<UsbSerialPort> ports = driver.getPorts();

            for (int i = 0; i < ports.size(); i++) {
                if (ports.size() > 1)
                    key = String.format("tty%04X:%04X:%d", vid, pid, i);
                else
                    key = String.format("tty%04X:%04X", vid, pid);

                m_serialports.put(key, ports.get(i));
            }
        }
    }
   
   
    public String[] serial_getDeviceList()
    {
        return m_serialports.keySet().toArray(new String[0]);
    }
   
   
    public String serial_getDescription(String id)
    {
        if (!m_serialports.containsKey(id))
            return "";
         
        UsbSerialPort port = m_serialports.get(id);
      
        return port.getDriver().getDevice().getProductName();
    }
   
   
    public String serial_getManufacturer(String id)
    {
        if (!m_serialports.containsKey(id))
            return "";
         
        UsbSerialPort port = m_serialports.get(id);
      
        return port.getDriver().getDevice().getManufacturerName();
    }
   
   
    public String serial_getSerialNumber(String id)
    {
        if (!m_serialports.containsKey(id))
            return "";
         
        UsbSerialPort port = m_serialports.get(id);
      
        return port.getDriver().getDevice().getSerialNumber();
    }
   
   
    public String serial_getSystemLocation(String id)
    {
        if (!m_serialports.containsKey(id))
            return "";
         
        UsbSerialPort port = m_serialports.get(id);
      
        return port.getDriver().getDevice().getDeviceName();
    }
   
   
    public boolean serial_isOpen(String id)
    {
        if (!m_serialports.containsKey(id))
            return true;
         
        UsbSerialPort port = m_serialports.get(id);
      
        return port.isOpen();
    }
   
   
    public boolean serial_getDTR(String id, int dtr)
    {
        if (!m_serialports.containsKey(id))
            return false;
         
        UsbSerialPort port = m_serialports.get(id);
      
        if (dtr != -1)
            try {
                port.setDTR(dtr == 1);
            } catch (IOException ex) {
                return false;
            }
         
        try {
            return port.getDTR();
        } catch (IOException ex) {
            return false;
        }
    }
   
   
    public boolean serial_getRTS(String id, int rts)
    {
        if (!m_serialports.containsKey(id))
            return false;
         
        UsbSerialPort port = m_serialports.get(id);
      
        if (rts != -1)
            try {
                port.setRTS(rts == 1);
            } catch (IOException ex) {
                return false;
            }
         
        try {
            return port.getRTS();
        } catch (IOException ex) {
            return false;
        }
    }
   
   
    public int serial_open(String id, String mode)
    {
        if (!m_serialports.containsKey(id))
            return -1;
         
        UsbSerialPort port = m_serialports.get(id);
      
        if (port.isOpen())
            return -1;

        String[] amode = mode.replace(" ", "").toUpperCase().split(",");
      
        int baudrate = 0;
        int parity = 0;
        int databits = 0;
        int stopbits = 0;
      
        baudrate = Integer.parseInt(amode[0]);
      
        if (baudrate == 0)
            return -1;
         
        if (amode[1].equals("N"))
            parity = UsbSerialPort.PARITY_NONE;
        else if (amode[1].equals("E"))
            parity = UsbSerialPort.PARITY_EVEN;
        else if (amode[1].equals("O"))
            parity = UsbSerialPort.PARITY_ODD;
        else if (amode[1].equals("S"))
            parity = UsbSerialPort.PARITY_SPACE;
        else if (amode[1].equals("M"))
            parity = UsbSerialPort.PARITY_MARK;
        else
            return -1;

        if (amode[2].equals("8"))
            databits = UsbSerialPort.DATABITS_8;
        else if (amode[2].equals("7"))
            databits = UsbSerialPort.DATABITS_7;
        else if (amode[2].equals("6"))
            databits = UsbSerialPort.DATABITS_6;
        else if (amode[2].equals("5"))
            databits = UsbSerialPort.DATABITS_5;
        else
            return -1;

        if (amode[3].equals("1"))
            stopbits = UsbSerialPort.STOPBITS_1;
        else if (amode[3].equals("1.5"))
            stopbits = UsbSerialPort.STOPBITS_1_5;
        else if (amode[3].equals("2"))
            stopbits = UsbSerialPort.STOPBITS_2;
        else
            return -1;

        PendingIntent pendint = PendingIntent.getBroadcast(m_context, 0, new Intent(ACTION_USB_PERMISSION), PendingIntent.FLAG_IMMUTABLE);
        IntentFilter filter = new IntentFilter(ACTION_USB_PERMISSION);
        UsbReceiver usbReceiver = new UsbReceiver();
        m_context.registerReceiver(usbReceiver, filter);
        m_usbmanager.requestPermission(port.getDriver().getDevice(), pendint);
      
        try {
            synchronized(m_lock) {
                m_lock.wait();
            }
        } catch (InterruptedException ex) {
            return -1;
        }

        UsbDeviceConnection connection = m_usbmanager.openDevice(port.getDriver().getDevice());
      
        if (connection == null)
            return -1;
         
        try {
            port.open(connection);
            port.setParameters(baudrate, databits, stopbits, parity);
            return 0;
        } catch (IOException ex) {
            return -1;
        }
    }


    public boolean serial_close(String id)
    {
        if (!m_serialports.containsKey(id))
            return false;
         
        UsbSerialPort port = m_serialports.get(id);
      
        if (!port.isOpen())
            return false;
         
        try {
            port.close();
            return true;
        } catch (IOException ex) {
            return false;
        }
    }
   
   
    public int serial_read(String id, byte[] dest, int timeout)
    {
        if (!m_serialports.containsKey(id))
            return -1;
         
        UsbSerialPort port = m_serialports.get(id);
      
        if (!port.isOpen())
            return -1;

        try {
            return port.read(dest, dest.length, timeout);
        } catch (IOException ex) {
            return -1;
        }
    }
   
   
    public int serial_write(String id, byte[] data)
    {
        if (!m_serialports.containsKey(id))
            return -1;
         
        UsbSerialPort port = m_serialports.get(id);
      
        if (!port.isOpen())
            return -1;
      
        try {
            port.write(data, 0);
            return data.length;
        } catch (IOException ex) {
            return -1;
        }
    }
   
   
    public List<String> audio_getDeviceList(String mode)
    {
        List<String> ret = new ArrayList<>();
        int imode;
      
        if (mode.equals("INPUT"))
            imode = AudioManager.GET_DEVICES_INPUTS;
        else if (mode.equals("OUTPUT"))
            imode = AudioManager.GET_DEVICES_OUTPUTS;
        else
           return ret;
        
        AudioDeviceInfo[] devices = m_audiomanager.getDevices(imode);
        String type, element;
      
        for (AudioDeviceInfo device : devices) {
            type = audioType(device.getType());
            if (!type.equals("Unknown")) {
                element = type + " (" + device.getProductName() + ")";
                if (ret.indexOf(element) == -1)
                    ret.add(element);
            }
        }
      
        return ret;
    }
   
   
    public int audio_getDeviceId(String mode, String name)
    {
        int imode;
      
        if (mode.equals("INPUT"))
            imode = AudioManager.GET_DEVICES_INPUTS;
        else if (mode.equals("OUTPUT"))
            imode = AudioManager.GET_DEVICES_OUTPUTS;
        else
           return -1;

        AudioDeviceInfo[] devices = m_audiomanager.getDevices(imode);
        String type;
      
        for (AudioDeviceInfo device : devices) {
            type = audioType(device.getType());
            if (name.equals(type + " (" + device.getProductName() + ")"))
                return device.getId();
        }
         
        return -1;
    }
   
   
    public int[] audio_getDeviceEncodings(String mode, String name)
    {
        int imode;
      
        if (mode.equals("INPUT"))
            imode = AudioManager.GET_DEVICES_INPUTS;
        else if (mode.equals("OUTPUT"))
            imode = AudioManager.GET_DEVICES_OUTPUTS;
        else
           return null;

        AudioDeviceInfo[] devices = m_audiomanager.getDevices(imode);
        String type;
      
        for (AudioDeviceInfo device : devices) {
            type = audioType(device.getType());
            if (name.equals(type + " (" + device.getProductName() + ")")) {
                int newlen = 0; 
                int[] enc = device.getEncodings();
                for (int i = 0; i < enc.length; i++) {
                    if (enc[i] == AudioFormat.ENCODING_PCM_8BIT)
                        enc[i] = 8;
                    else if (enc[i] == AudioFormat.ENCODING_PCM_16BIT)
                        enc[i] = 16;
                    else if (enc[i] == AudioFormat.ENCODING_PCM_FLOAT)
                        enc[i] = 32;
                    else
                        enc[i] = 0;
                    if (enc[i] != 0)
                        newlen++;
                }
                int[] ienc = new int[newlen];
                int j = 0;
                for (int i = 0; i < enc.length; i++)
                    if (enc[i] != 0)
                        ienc[j++] = enc[i];
                Arrays.sort(ienc);
                return ienc;
            }
        }
         
        return null;
    }
   
   
    public int[] audio_getDeviceSampleRates(String mode, String name)
    {
        int imode;
      
        if (mode.equals("INPUT"))
            imode = AudioManager.GET_DEVICES_INPUTS;
        else if (mode.equals("OUTPUT"))
            imode = AudioManager.GET_DEVICES_OUTPUTS;
        else
           return null;

        AudioDeviceInfo[] devices = m_audiomanager.getDevices(imode);
        String type;
      
        for (AudioDeviceInfo device : devices) {
            type = audioType(device.getType());
            if (name.equals(type + " (" + device.getProductName() + ")")) {
                int[] rates = device.getSampleRates();
                Arrays.sort(rates);
                return rates;
            }
        }
         
        return null;
    }
   
   
    public String audioType(int type)
    {
        if (type == AudioDeviceInfo.TYPE_AUX_LINE)
            return "Aux Line";
        else if (type == AudioDeviceInfo.TYPE_BLE_BROADCAST)
            return "BLE Bradcast";
        else if (type == AudioDeviceInfo.TYPE_BLE_HEADSET)
            return "BLE Headset";
        else if (type == AudioDeviceInfo.TYPE_BLE_SPEAKER)
            return "BLE Speaker";
        else if (type == AudioDeviceInfo.TYPE_BLUETOOTH_A2DP)
            return "Bluetooth A2DP";
        else if (type == AudioDeviceInfo.TYPE_BLUETOOTH_SCO)
            return "Bluetooth SCO";
        else if (type == AudioDeviceInfo.TYPE_BUILTIN_EARPIECE)
            return "Builtin Earpiece";
        else if (type == AudioDeviceInfo.TYPE_BUILTIN_MIC)
            return "Builtin Mic";
        else if (type == AudioDeviceInfo.TYPE_BUILTIN_SPEAKER)
            return "Builtin Speaker";
        else if (type == AudioDeviceInfo.TYPE_BUILTIN_SPEAKER_SAFE)
            return "Builtin Speaker Safe";
        else if (type == AudioDeviceInfo.TYPE_BUS)
            return "Bus";
        else if (type == AudioDeviceInfo.TYPE_DOCK)
            return "Dock";
        else if (type == AudioDeviceInfo.TYPE_DOCK_ANALOG)
            return "Dock Analog";
        else if (type == AudioDeviceInfo.TYPE_FM)
            return "FM";
        else if (type == AudioDeviceInfo.TYPE_HDMI)
            return "HDMI";
        else if (type == AudioDeviceInfo.TYPE_HDMI_ARC)
            return "HDMI ARC";
        else if (type == AudioDeviceInfo.TYPE_HDMI_EARC)
            return "HDMI EARC";
        else if (type == AudioDeviceInfo.TYPE_HEARING_AID)
            return "Hearing Aid";
        else if (type == AudioDeviceInfo.TYPE_IP)
            return "IP";
        else if (type == AudioDeviceInfo.TYPE_LINE_ANALOG)
            return "Line Analog";
        else if (type == AudioDeviceInfo.TYPE_LINE_DIGITAL)
            return "Line Digital";
        else if (type == AudioDeviceInfo.TYPE_REMOTE_SUBMIX)
            return "Remote Submix";
        else if (type == AudioDeviceInfo.TYPE_TELEPHONY)
            return "Telephony";
        else if (type == AudioDeviceInfo.TYPE_TV_TUNER)
            return "TV Tuner";
        else if (type == AudioDeviceInfo.TYPE_USB_ACCESSORY)
            return "USB Accessory";
        else if (type == AudioDeviceInfo.TYPE_USB_DEVICE)
            return "USB Device";
        else if (type == AudioDeviceInfo.TYPE_USB_HEADSET)
            return "USB Headset";
        else if (type == AudioDeviceInfo.TYPE_WIRED_HEADPHONES)
            return "Wired Headphones";
        else if (type == AudioDeviceInfo.TYPE_WIRED_HEADSET)
            return "Wired Headset";
        else
            return "Unknown";
    }
   
   
    class UsbReceiver extends BroadcastReceiver
    {
        @Override
        public void onReceive(Context context, Intent intent)
        {
            if (ACTION_USB_PERMISSION.equals(intent.getAction()))
                synchronized(m_lock) {
                    m_lock.notifyAll();
                }
        }
    }
}