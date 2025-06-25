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

#ifndef ALIB_H
#define ALIB_H

#include "libusb.h"

#if defined(__cplusplus)
extern "C" {
#endif

int alibusb_init(void);
ssize_t alibusb_get_device_list(libusb_context *ctx, libusb_device ***list);
int alibusb_get_active_config_descriptor(libusb_device *dev, struct libusb_config_descriptor **config);
int alibusb_get_config_descriptor(libusb_device *dev, uint8_t config_index, struct libusb_config_descriptor **config);
int alibusb_get_string_descriptor(libusb_device_handle *dev_handle, uint8_t desc_index, uint16_t langid, unsigned char *data, int length); // Also defined in libusb.h
int alibusb_open(libusb_device *dev, libusb_device_handle **dev_handle);
void alibusb_close(libusb_device_handle *dev_handle);

void LIBUSB_CALL alibserial_init(void);
ssize_t LIBUSB_CALL alibserial_get_device_list(char ***list);
const char * LIBUSB_CALL alibserial_description(char *id);
const char * LIBUSB_CALL alibserial_manufacturer(char *id);
const char * LIBUSB_CALL alibserial_serialnumber(char *id);
const char * LIBUSB_CALL alibserial_systemlocation(char *id);
int LIBUSB_CALL alibserial_isopen(char *id);
int LIBUSB_CALL alibserial_dtr(char *id, int dtr);
int LIBUSB_CALL alibserial_rts(char *id, int rts);
int LIBUSB_CALL alibserial_open(char *id, char *mode);
int LIBUSB_CALL alibserial_close(char *id);
int LIBUSB_CALL alibserial_read(char *id, char *data, int buffersize, int timeout);
int LIBUSB_CALL alibserial_write(char *id, char *data);

ssize_t LIBUSB_CALL alibaudio_get_device_list(char *mode, char ***list);
int LIBUSB_CALL alibaudio_get_device_id(char *mode, char *name);
ssize_t LIBUSB_CALL alibaudio_get_device_encodings(char *mode, char *name, int **list);
ssize_t LIBUSB_CALL alibaudio_get_device_samplerates(char *mode, char *name, int **list);

#if defined(__cplusplus)
}
#endif

#endif