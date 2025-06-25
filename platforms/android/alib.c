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

#include "alib.h"
#include "libusbi.h"
#include <jni.h>
#include <string.h>

jint      jni_ver = JNI_VERSION_1_6;
JavaVM   *jni_vm = NULL;
jobject   jni_obj = NULL;
jmethodID jni_usb_getDeviceList = NULL;
jmethodID jni_usb_getConfigDescriptor = NULL;
jmethodID jni_usb_getStringDescriptor = NULL;
jmethodID jni_usb_open = NULL;
jmethodID jni_usb_close = NULL;
jmethodID jni_serial_init = NULL;
jmethodID jni_serial_getDeviceList = NULL;
jmethodID jni_serial_getDescription = NULL;
jmethodID jni_serial_getManufacturer = NULL;
jmethodID jni_serial_getSerialNumber = NULL;
jmethodID jni_serial_getSystemLocation = NULL;
jmethodID jni_serial_isOpen = NULL;
jmethodID jni_serial_getDTR = NULL;
jmethodID jni_serial_getRTS = NULL;
jmethodID jni_serial_open = NULL;
jmethodID jni_serial_close = NULL;
jmethodID jni_serial_read = NULL;
jmethodID jni_serial_write = NULL;
jmethodID jni_audio_getDeviceList = NULL;
jmethodID jni_audio_getDeviceId = NULL;
jmethodID jni_audio_getDeviceEncodings = NULL;
jmethodID jni_audio_getDeviceSampleRates = NULL;


JNIEXPORT jint JNI_OnLoad(JavaVM* vm, void* reserved)
{
    (void)reserved;

    if (!vm)
        return JNI_ERR;

    jni_vm = vm;

    JNIEnv *env;
    if ((*jni_vm)->GetEnv(jni_vm, (void **)&env, jni_ver) != JNI_OK)
        return JNI_ERR;

    jclass cls_activityThread = (*env)->FindClass(env,"android/app/ActivityThread");

    if (!cls_activityThread)
        return JNI_ERR;

    jmethodID met_currentActivityThread = (*env)->GetStaticMethodID(env, cls_activityThread, "currentActivityThread", "()Landroid/app/ActivityThread;");

    if (!met_currentActivityThread)
        return JNI_ERR;

    jobject activityThread = (*env)->CallStaticObjectMethod(env, cls_activityThread, met_currentActivityThread);

    if (!activityThread)
        return JNI_ERR;

    jmethodID met_getApplication = (*env)->GetMethodID(env, cls_activityThread, "getApplication", "()Landroid/app/Application;");

    if (!met_getApplication)
        return JNI_ERR;

    jobject context = (*env)->CallObjectMethod(env, activityThread, met_getApplication);

    if (!context)
        return JNI_ERR;

    jclass cls_alib = (*env)->FindClass(env, "com/nilibox/niliBOX/alib");

    if (!cls_alib)
        return JNI_ERR;

    jmethodID met_init = (*env)->GetMethodID(env, cls_alib, "<init>", "(Landroid/content/Context;)V");

    if (!met_init)
        return JNI_ERR;

    jobject local_obj = (*env)->NewObject(env, cls_alib, met_init, context);

    if (!local_obj)
        return JNI_ERR;

    jni_obj = (*env)->NewGlobalRef(env, local_obj);
    (*env)->DeleteLocalRef(env, local_obj);

    if (!jni_obj)
        return JNI_ERR;

    jni_usb_getDeviceList = (*env)->GetMethodID(env, cls_alib, "usb_getDeviceList", "()[Ljava/lang/Object;");
    jni_usb_getConfigDescriptor = (*env)->GetMethodID(env, cls_alib, "usb_getConfigDescriptor", "(III)Ljava/lang/Object;");
    jni_usb_getStringDescriptor = (*env)->GetMethodID(env, cls_alib, "usb_getStringDescriptor", "(III)Ljava/lang/String;");
    jni_usb_open = (*env)->GetMethodID(env, cls_alib, "usb_openDevice", "(I)I");
    jni_usb_close = (*env)->GetMethodID(env, cls_alib, "usb_closeDevice", "(I)V");
    jni_serial_init = (*env)->GetMethodID(env, cls_alib, "serial_init", "()V");
    jni_serial_getDeviceList = (*env)->GetMethodID(env, cls_alib, "serial_getDeviceList", "()[Ljava/lang/String;");
    jni_serial_getDescription = (*env)->GetMethodID(env, cls_alib, "serial_getDescription", "(Ljava/lang/String;)Ljava/lang/String;");
    jni_serial_getManufacturer = (*env)->GetMethodID(env, cls_alib, "serial_getManufacturer", "(Ljava/lang/String;)Ljava/lang/String;");
    jni_serial_getSerialNumber = (*env)->GetMethodID(env, cls_alib, "serial_getSerialNumber", "(Ljava/lang/String;)Ljava/lang/String;");
    jni_serial_getSystemLocation = (*env)->GetMethodID(env, cls_alib, "serial_getSystemLocation", "(Ljava/lang/String;)Ljava/lang/String;");
    jni_serial_isOpen = (*env)->GetMethodID(env, cls_alib, "serial_isOpen", "(Ljava/lang/String;)Z");
    jni_serial_getDTR = (*env)->GetMethodID(env, cls_alib, "serial_getDTR", "(Ljava/lang/String;I)Z");
    jni_serial_getRTS = (*env)->GetMethodID(env, cls_alib, "serial_getRTS", "(Ljava/lang/String;I)Z");
    jni_serial_open = (*env)->GetMethodID(env, cls_alib, "serial_open", "(Ljava/lang/String;Ljava/lang/String;)I");
    jni_serial_close = (*env)->GetMethodID(env, cls_alib, "serial_close", "(Ljava/lang/String;)Z");
    jni_serial_read = (*env)->GetMethodID(env, cls_alib, "serial_read", "(Ljava/lang/String;[BI)I");
    jni_serial_write = (*env)->GetMethodID(env, cls_alib, "serial_write", "(Ljava/lang/String;[B)I");
    jni_audio_getDeviceList = (*env)->GetMethodID(env, cls_alib, "audio_getDeviceList", "(Ljava/lang/String;)Ljava/util/List;");
    jni_audio_getDeviceId = (*env)->GetMethodID(env, cls_alib, "audio_getDeviceId", "(Ljava/lang/String;Ljava/lang/String;)I");
    jni_audio_getDeviceEncodings = (*env)->GetMethodID(env, cls_alib, "audio_getDeviceEncodings", "(Ljava/lang/String;Ljava/lang/String;)[I");
    jni_audio_getDeviceSampleRates = (*env)->GetMethodID(env, cls_alib, "audio_getDeviceSampleRates", "(Ljava/lang/String;Ljava/lang/String;)[I");

    return jni_ver;
}


JNIEXPORT void JNI_OnUnload(JavaVM* vm, void* reserved)
{
    (void)reserved;

    JNIEnv *env;
    if ((*vm)->GetEnv(vm, (void **)&env, jni_ver) != JNI_OK)
        return;

    if (!jni_obj)
        return;

    (*env)->DeleteGlobalRef(env, jni_obj);
}


int alibusb_init()
{
    libusb_set_option(NULL, LIBUSB_OPTION_NO_DEVICE_DISCOVERY);

    return 0;
}


ssize_t alibusb_get_device_list(libusb_context *ctx, libusb_device ***list)
{
    if (!jni_usb_getDeviceList)
        return 0;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return 0;
        attached = true;
    }

    struct libusb_device **ret = calloc(1, sizeof(struct libusb_device *));
    ret[0] = NULL;
    *list = ret;

    jobjectArray devices = (jobjectArray) (*env)->CallObjectMethod(env, jni_obj, jni_usb_getDeviceList);

    jsize n = (*env)->GetArrayLength(env, devices);

    if (n == 0) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return 0;
    }

    free(ret);
    ret = calloc(n + 1, sizeof(struct libusb_device *));
    ret[n] = NULL;

    jclass cls_dev = (*env)->FindClass(env, "android/hardware/usb/UsbDevice");

    for (int i = 0; i < n; i++) {
        jobject device = (*env)->GetObjectArrayElement(env, devices, i);
        struct libusb_device *dev = malloc(sizeof(struct libusb_device));

        dev->refcnt = 0L;
        dev->ctx = ctx;
        dev->parent_dev = NULL;
        dev->bus_number = 0;
        dev->port_number = 0;
        dev->device_address = 0xff & (*env)->CallIntMethod(env, device, (*env)->GetMethodID(env, cls_dev, "getDeviceId", "()I"));
        dev->speed = LIBUSB_SPEED_UNKNOWN;
        dev->list.prev = NULL;
        dev->list.next = NULL;
        dev->session_data = 0L;
        dev->device_descriptor.bLength = 18;
        dev->device_descriptor.bDescriptorType = LIBUSB_DT_DEVICE;
        dev->device_descriptor.bcdUSB = 0x0200;
        dev->device_descriptor.bDeviceClass = (*env)->CallIntMethod(env, device, (*env)->GetMethodID(env, cls_dev, "getDeviceClass", "()I"));
        dev->device_descriptor.bDeviceSubClass = (*env)->CallIntMethod(env, device, (*env)->GetMethodID(env, cls_dev, "getDeviceSubclass", "()I"));
        dev->device_descriptor.bDeviceProtocol = (*env)->CallIntMethod(env, device, (*env)->GetMethodID(env, cls_dev, "getDeviceProtocol", "()I"));
        dev->device_descriptor.bMaxPacketSize0 = 64;
        dev->device_descriptor.idVendor = (*env)->CallIntMethod(env, device, (*env)->GetMethodID(env, cls_dev, "getVendorId", "()I"));
        dev->device_descriptor.idProduct = (*env)->CallIntMethod(env, device, (*env)->GetMethodID(env, cls_dev, "getProductId", "()I"));
        dev->device_descriptor.bcdDevice = 0x0100;
        dev->device_descriptor.iManufacturer = 1;
        dev->device_descriptor.iProduct = 2;
        dev->device_descriptor.iSerialNumber = 3;
        dev->device_descriptor.bNumConfigurations = (*env)->CallIntMethod(env, device, (*env)->GetMethodID(env, cls_dev, "getConfigurationCount", "()I"));
        dev->attached = 0L;

        ret[i] = dev;
    }

    *list = ret;

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return n;
}


int alibusb_get_active_config_descriptor(libusb_device *dev, struct libusb_config_descriptor **config)
{
    return alibusb_get_config_descriptor(dev, 255, config);
}


int alibusb_get_config_descriptor(libusb_device *dev, uint8_t config_index, struct libusb_config_descriptor **config)
{
    if (!dev || !jni_usb_getConfigDescriptor)
        return LIBUSB_ERROR_OTHER;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return LIBUSB_ERROR_OTHER;
        attached = true;
    }

    jobject obj_cnf = (jobject) (*env)->CallObjectMethod(env, jni_obj, jni_usb_getConfigDescriptor, dev->device_descriptor.idVendor, dev->device_descriptor.idProduct, config_index);

    if (!obj_cnf) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return  LIBUSB_ERROR_OTHER;
    }

    jclass cls_cnf = (*env)->FindClass(env, "android/hardware/usb/UsbConfiguration");
    jclass cls_int = (*env)->FindClass(env, "android/hardware/usb/UsbInterface");
    jclass cls_end = (*env)->FindClass(env, "android/hardware/usb/UsbEndpoint");

    int raw_num_int = (*env)->CallIntMethod(env, obj_cnf, (*env)->GetMethodID(env, cls_cnf, "getInterfaceCount", "()I"));

    int num_interfaces = -1;
    for (int i = 0; i < raw_num_int; i++) {
        jobject obj_int = (jobject) (*env)->CallObjectMethod(env, obj_cnf, (*env)->GetMethodID(env, cls_cnf, "getInterface", "(I)Landroid/hardware/usb/UsbInterface;"), i);
        int nint = (*env)->CallIntMethod(env, obj_int, (*env)->GetMethodID(env, cls_int, "getId", "()I"));
        if (nint > num_interfaces)
            num_interfaces = nint;
    }
    num_interfaces++;

    if (num_interfaces < 1) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return  LIBUSB_ERROR_OTHER;
    }

    int *num_alt_settings = (int *)malloc(num_interfaces * sizeof(int));
    for (int i = 0; i < num_interfaces; i++)
        num_alt_settings[i] = -1;

    for (int i = 0; i < raw_num_int; i++) {
        jobject obj_int = (jobject) (*env)->CallObjectMethod(env, obj_cnf, (*env)->GetMethodID(env, cls_cnf, "getInterface", "(I)Landroid/hardware/usb/UsbInterface;"), i);
        int nint = (*env)->CallIntMethod(env, obj_int, (*env)->GetMethodID(env, cls_int, "getId", "()I"));
        int nalt = (*env)->CallIntMethod(env, obj_int, (*env)->GetMethodID(env, cls_int, "getAlternateSetting", "()I"));
        if (nalt > num_alt_settings[nint])
            num_alt_settings[nint] = nalt;
    }

    for (int i = 0; i < num_interfaces; i++)
        num_alt_settings[i]++;

    struct libusb_config_descriptor *cnf = (struct libusb_config_descriptor *)malloc(sizeof(struct libusb_config_descriptor));
    struct libusb_interface *interface = (struct libusb_interface *)malloc(num_interfaces * sizeof(struct libusb_interface));
    for (int i = 0; i < num_interfaces; i++) {
        interface[i].num_altsetting = num_alt_settings[i];
        if (num_alt_settings[i] > 0)
            interface[i].altsetting = (struct libusb_interface_descriptor *)malloc(num_alt_settings[i] * sizeof(struct libusb_interface_descriptor));
        else
            interface[i].altsetting = NULL;
    }

    free(num_alt_settings);

    cnf->bLength = 9;
    cnf->bDescriptorType = LIBUSB_DT_CONFIG;
    cnf->wTotalLength = 9;
    cnf->bNumInterfaces = num_interfaces;
    cnf->bConfigurationValue = (*env)->CallIntMethod(env, obj_cnf, (*env)->GetMethodID(env, cls_cnf, "getId", "()I"));
    cnf->iConfiguration = 0;
    cnf->bmAttributes = 128 +
                        ((*env)->CallBooleanMethod(env, obj_cnf, (*env)->GetMethodID(env, cls_cnf, "isSelfPowered", "()Z")) ? 64 : 0) +
                        ((*env)->CallBooleanMethod(env, obj_cnf, (*env)->GetMethodID(env, cls_cnf, "isRemoteWakeup", "()Z")) ? 32 : 0);
    cnf->MaxPower = (*env)->CallIntMethod(env, obj_cnf, (*env)->GetMethodID(env, cls_cnf, "getMaxPower", "()I")) / 2;
    cnf->interface = interface;
    cnf->extra = NULL;
    cnf->extra_length = 0;
    for (int i = 0; i < raw_num_int; i++) {
        jobject obj_int = (jobject) (*env)->CallObjectMethod(env, obj_cnf, (*env)->GetMethodID(env, cls_cnf, "getInterface", "(I)Landroid/hardware/usb/UsbInterface;"), i);
        int nint = (*env)->CallIntMethod(env, obj_int, (*env)->GetMethodID(env, cls_int, "getId", "()I"));
        int nalt = (*env)->CallIntMethod(env, obj_int, (*env)->GetMethodID(env, cls_int, "getAlternateSetting", "()I"));
        struct libusb_interface_descriptor altsetting;
        altsetting.bLength = 9;
        altsetting.bDescriptorType = LIBUSB_DT_INTERFACE;
        altsetting.bInterfaceNumber = nint;
        altsetting.bAlternateSetting = nalt;
        altsetting.bNumEndpoints = (*env)->CallIntMethod(env, obj_int, (*env)->GetMethodID(env, cls_int, "getEndpointCount", "()I"));
        altsetting.bInterfaceClass = (*env)->CallIntMethod(env, obj_int, (*env)->GetMethodID(env, cls_int, "getInterfaceClass", "()I"));
        altsetting.bInterfaceSubClass = (*env)->CallIntMethod(env, obj_int, (*env)->GetMethodID(env, cls_int, "getInterfaceSubclass", "()I"));
        altsetting.bInterfaceProtocol = (*env)->CallIntMethod(env, obj_int, (*env)->GetMethodID(env, cls_int, "getInterfaceProtocol", "()I"));
        altsetting.iInterface = 0;
        struct libusb_endpoint_descriptor *endpoint = (struct libusb_endpoint_descriptor *)malloc(altsetting.bNumEndpoints * sizeof(struct libusb_endpoint_descriptor));
        altsetting.endpoint = endpoint;
        altsetting.extra = NULL;
        altsetting.extra_length = 0;
        cnf->wTotalLength += 9;
        for (int j = 0; j < altsetting.bNumEndpoints; j++) {
            jobject obj_end = (jobject) (*env)->CallObjectMethod(env, obj_int, (*env)->GetMethodID(env, cls_int, "getEndpoint", "(I)Landroid/hardware/usb/UsbEndpoint;"), j);
            endpoint[j].bLength = 7;
            endpoint[j].bDescriptorType = LIBUSB_DT_ENDPOINT;
            endpoint[j].bEndpointAddress = (*env)->CallIntMethod(env, obj_end, (*env)->GetMethodID(env, cls_end, "getAddress", "()I"));
            endpoint[j].bmAttributes = (*env)->CallIntMethod(env, obj_end, (*env)->GetMethodID(env, cls_end, "getAttributes", "()I"));
            endpoint[j].wMaxPacketSize = (*env)->CallIntMethod(env, obj_end, (*env)->GetMethodID(env, cls_end, "getMaxPacketSize", "()I"));
            endpoint[j].bInterval = (*env)->CallIntMethod(env, obj_end, (*env)->GetMethodID(env, cls_end, "getInterval", "()I"));
            endpoint[j].bRefresh = 0;
            endpoint[j].bSynchAddress = 0;
            endpoint[j].extra = NULL;
            endpoint[j].extra_length = 0;
            cnf->wTotalLength += 7;
        }
        memcpy((void *)(interface[nint].altsetting + nalt), &altsetting, sizeof(struct libusb_interface_descriptor));
    }

    *config = cnf;

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return LIBUSB_SUCCESS;
}


int alibusb_get_string_descriptor(libusb_device_handle *dev_handle, uint8_t desc_index, uint16_t langid, unsigned char *data, int length)
{
    (void)langid;

    if (!dev_handle || !jni_usb_getStringDescriptor)
        return LIBUSB_ERROR_OTHER;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return LIBUSB_ERROR_OTHER;
        attached = true;
    }

    libusb_device *dev = dev_handle->dev;

    if (!dev) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return LIBUSB_ERROR_OTHER;
    }

    jstring string  = (jstring) (*env)->CallObjectMethod(env, jni_obj, jni_usb_getStringDescriptor, dev->device_descriptor.idVendor, dev->device_descriptor.idProduct, desc_index);

    const char *str = (*env)->GetStringUTFChars(env, string, 0);
    jsize strlen = (*env)->GetStringUTFLength(env, string);

    strncpy((char *)data, str, length);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return strlen;
}


int alibusb_open(libusb_device *dev, libusb_device_handle **dev_handle)
{
    if (!dev || !jni_usb_open)
        return LIBUSB_ERROR_OTHER;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return LIBUSB_ERROR_OTHER;
        attached = true;
    }

    jint sys_dev = (*env)->CallIntMethod(env, jni_obj, jni_usb_open, dev->device_address);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    if (sys_dev != -1)
        return libusb_wrap_sys_device(dev->ctx, sys_dev, dev_handle);
    else
        return LIBUSB_ERROR_OTHER;
}


void alibusb_close(libusb_device_handle *dev_handle)
{
    if (!dev_handle || !jni_usb_close)
        return;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return;
        attached = true;
    }

    libusb_device *dev = dev_handle->dev;

    if (!dev) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return;
    }

    (*env)->CallVoidMethod(env, jni_obj, jni_usb_close, dev->device_address);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);
}


void API_EXPORTED alibserial_init()
{
    if (!jni_serial_init)
        return;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return;
        attached = true;
    }

    (*env)->CallVoidMethod(env, jni_obj, jni_serial_init);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);
}


ssize_t API_EXPORTED alibserial_get_device_list(char ***list)
{
    if (!jni_serial_getDeviceList)
        return 0;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return 0;
        attached = true;
    }

    jobjectArray devices = (jobjectArray) (*env)->CallObjectMethod(env, jni_obj, jni_serial_getDeviceList);

    if (!devices) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return 0;
    }

    int n = (int)(*env)->GetArrayLength(env, devices);

    if (n == 0) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return 0;
    }

    if (!list) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return n;
    }

    char **ret = calloc(n, sizeof(char *));

    for (int i = 0; i < n; i++) {
        jstring jdevice = (jstring)(*env)->GetObjectArrayElement(env, devices, i);
        const char *cdevice = (*env)->GetStringUTFChars(env, jdevice, 0);
        size_t l = strlen(cdevice) + 1;
        *(ret + i) = (char *)calloc(l, sizeof(char));
        strcpy(*(ret + i), cdevice);
        (*env)->ReleaseStringUTFChars(env, jdevice, cdevice);
        (*env)->DeleteLocalRef(env, jdevice);
    }

    *list = ret;

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return n;
}


const char * API_EXPORTED alibserial_description(char *id)
{
    if (!jni_serial_getDescription)
        return NULL;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return NULL;
        attached = true;
    }

    jstring jid = (*env)->NewStringUTF(env, id);

    jstring ret = (jstring) (*env)->CallObjectMethod(env, jni_obj, jni_serial_getDescription, jid);

    if (!ret) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return NULL;
    }

    const char *r = (*env)->GetStringUTFChars(env, ret, 0);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return r;
}


const char * API_EXPORTED alibserial_manufacturer(char *id)
{
    if (!jni_serial_getManufacturer)
        return NULL;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return NULL;
        attached = true;
    }

    jstring jid = (*env)->NewStringUTF(env, id);

    jstring ret = (jstring) (*env)->CallObjectMethod(env, jni_obj, jni_serial_getManufacturer, jid);

    if (!ret) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return NULL;
    }

    const char *r = (*env)->GetStringUTFChars(env, ret, 0);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return r;
}


const char * API_EXPORTED alibserial_serialnumber(char *id)
{
    if (!jni_serial_getSerialNumber)
        return NULL;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return NULL;
        attached = true;
    }

    jstring jid = (*env)->NewStringUTF(env, id);

    jstring ret = (jstring) (*env)->CallObjectMethod(env, jni_obj, jni_serial_getSerialNumber, jid);

    if (!ret) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return NULL;
    }

    const char *r = (*env)->GetStringUTFChars(env, ret, 0);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return r;
}


const char * API_EXPORTED alibserial_systemlocation(char *id)
{
    if (!jni_serial_getSystemLocation)
        return NULL;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return NULL;
        attached = true;
    }

    jstring jid = (*env)->NewStringUTF(env, id);

    jstring ret = (jstring) (*env)->CallObjectMethod(env, jni_obj, jni_serial_getSystemLocation, jid);

    if (!ret) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return NULL;
    }

    const char *r = (*env)->GetStringUTFChars(env, ret, 0);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return r;
}


int API_EXPORTED alibserial_isopen(char *id)
{
    if (!jni_serial_isOpen)
        return 1;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return 1;
        attached = true;
    }

    jstring jid = (*env)->NewStringUTF(env, id);

    jboolean ret = (*env)->CallBooleanMethod(env, jni_obj, jni_serial_isOpen, jid);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return (ret == JNI_TRUE);
}


int API_EXPORTED alibserial_dtr(char *id, int dtr)
{
    if (!jni_serial_getDTR)
        return -1;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return -1;
        attached = true;
    }

    jstring jid = (*env)->NewStringUTF(env, id);

    jboolean ret = (*env)->CallBooleanMethod(env, jni_obj, jni_serial_getDTR, jid, dtr);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return (ret == JNI_TRUE);
}


int API_EXPORTED alibserial_rts(char *id, int rts)
{
    if (!jni_serial_getRTS)
        return -1;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return -1;
        attached = true;
    }

    jstring jid = (*env)->NewStringUTF(env, id);

    jboolean ret = (*env)->CallBooleanMethod(env, jni_obj, jni_serial_getRTS, jid, rts);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return (ret == JNI_TRUE);
}


int API_EXPORTED alibserial_open(char *id, char *mode)
{
    if (!jni_serial_open)
        return -1;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return -1;
        attached = true;
    }

    jstring jid = (*env)->NewStringUTF(env, id);
    jstring jmode  = (*env)->NewStringUTF(env, mode);

    int r = (int)(*env)->CallIntMethod(env, jni_obj, jni_serial_open, jid, jmode);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return r;
}


int API_EXPORTED alibserial_close(char *id)
{
    if (!jni_serial_close)
        return 0;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return 0;
        attached = true;
    }

    jstring jid = (*env)->NewStringUTF(env, id);

    jboolean ret = (*env)->CallBooleanMethod(env, jni_obj, jni_serial_close, jid);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return (ret == JNI_TRUE);
}


int API_EXPORTED alibserial_read(char *id, char *data, int buffersize, int timeout)
{
    if (!jni_serial_read)
        return -1;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return -1;
        attached = true;
    }

    jstring jid = (*env)->NewStringUTF(env, id);
    jbyteArray jdata = (*env)->NewByteArray(env, buffersize);

    jint len = (*env)->CallIntMethod(env, jni_obj, jni_serial_read, jid, jdata, timeout);

    if (len < 1) {
        (*env)->DeleteLocalRef(env, jid);
        (*env)->DeleteLocalRef(env, jdata);
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return 0;
    }

    jbyte *jret = (*env)->GetByteArrayElements(env, jdata, NULL);
    memcpy(data, jret, len);
    data[len] = 0;

    (*env)->ReleaseByteArrayElements(env, jdata, jret, JNI_ABORT);
    (*env)->DeleteLocalRef(env, jdata);
    (*env)->DeleteLocalRef(env, jid);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return len;
}


int API_EXPORTED alibserial_write(char *id, char *data)
{
    if (!jni_serial_write)
        return -1;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return -1;
        attached = true;
    }

    jsize len = strlen(data);

    jstring jid = (*env)->NewStringUTF(env, id);
    jbyteArray jdata = (*env)->NewByteArray(env, len);
    (*env)->SetByteArrayRegion(env, jdata, 0, len, (jbyte *)data);

    int r = (*env)->CallIntMethod(env, jni_obj, jni_serial_write, jid, jdata);

    (*env)->DeleteLocalRef(env, jid);
    (*env)->DeleteLocalRef(env, jdata);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return r;
}


ssize_t LIBUSB_CALL alibaudio_get_device_list(char *mode, char ***list)
{
    if (!jni_audio_getDeviceList)
        return -1;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return -1;
        attached = true;
    }

    jstring jmode = (*env)->NewStringUTF(env, mode);

    jobject values = (jobject) (*env)->CallObjectMethod(env, jni_obj, jni_audio_getDeviceList, jmode);

    if (!values) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return 0;
    }

    jclass listClass = (*env)->FindClass(env, "java/util/List");
    jmethodID sizeMethod = (*env)->GetMethodID(env, listClass, "size", "()I");
    jmethodID getMethod = (*env)->GetMethodID(env, listClass, "get", "(I)Ljava/lang/Object;");

    int n = (*env)->CallIntMethod(env, values, sizeMethod);

    if (n == 0) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return 0;
    }

    char **ret = calloc(n, sizeof(char *));

    for (int i = 0; i < n; i++) {
        jstring jvalue = (jstring)(*env)->CallObjectMethod(env, values, getMethod, i);
        const char *cvalue = (*env)->GetStringUTFChars(env, jvalue, 0);
        size_t l = strlen(cvalue) + 1;
        *(ret + i) = (char *)calloc(l, sizeof(char));
        strcpy(*(ret + i), cvalue);
        (*env)->ReleaseStringUTFChars(env, jvalue, cvalue);
        (*env)->DeleteLocalRef(env, jvalue);
    }

    *list = ret;

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return n;
}


int LIBUSB_CALL alibaudio_get_device_id(char *mode, char *name)
{
    if (!jni_audio_getDeviceId)
        return -1;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return -1;
        attached = true;
    }

    jstring jmode = (*env)->NewStringUTF(env, mode);
    jstring jname = (*env)->NewStringUTF(env, name);

    int r = (*env)->CallIntMethod(env, jni_obj, jni_audio_getDeviceId, jmode, jname);

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return r;
}


ssize_t LIBUSB_CALL alibaudio_get_device_encodings(char *mode, char *name, int **list)
{
    if (!jni_audio_getDeviceList)
        return -1;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return -1;
        attached = true;
    }

    jstring jmode = (*env)->NewStringUTF(env, mode);
    jstring jname = (*env)->NewStringUTF(env, name);

    jintArray values = (jintArray) (*env)->CallObjectMethod(env, jni_obj, jni_audio_getDeviceEncodings, jmode, jname);

    if (!values) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return 0;
    }

    int n = (*env)->GetArrayLength(env, values);

    if (n == 0) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return 0;
    }

    int *ret = calloc(n, sizeof(int));
    (*env)->GetIntArrayRegion(env, values, 0, n, ret);

    *list = ret;

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return n;
}


ssize_t LIBUSB_CALL alibaudio_get_device_samplerates(char *mode, char *name, int **list)
{
    if (!jni_audio_getDeviceList)
        return -1;

    JNIEnv *env;
    bool attached = false;
    if ((*jni_vm)->GetEnv(jni_vm, (void**)&env, jni_ver) != JNI_OK) {
        if ((*jni_vm)->AttachCurrentThread(jni_vm, &env, NULL) != 0)
            return -1;
        attached = true;
    }

    jstring jmode = (*env)->NewStringUTF(env, mode);
    jstring jname = (*env)->NewStringUTF(env, name);

    jintArray values = (jintArray) (*env)->CallObjectMethod(env, jni_obj, jni_audio_getDeviceSampleRates, jmode, jname);

    if (!values) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return 0;
    }

    int n = (*env)->GetArrayLength(env, values);

    if (n == 0) {
        if (attached)
            (*jni_vm)->DetachCurrentThread(jni_vm);
        return 0;
    }

    int *ret = calloc(n, sizeof(int));
    (*env)->GetIntArrayRegion(env, values, 0, n, ret);

    *list = ret;

    if (attached)
        (*jni_vm)->DetachCurrentThread(jni_vm);

    return n;
}
