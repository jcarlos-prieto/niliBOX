/* This file is parsed by m4 and windres and RC.EXE so please keep it simple. */
#include "version_nano.h"
#if !defined LIBUSB_MAJOR
#define LIBUSB_MAJOR 1
#endif
#if !defined LIBUSB_MINOR
#define LIBUSB_MINOR 0
#endif
#if !defined LIBUSB_MICRO
#define LIBUSB_MICRO 27
#endif
#if !defined LIBUSB_NANO
#define LIBUSB_NANO 0
#endif
/* LIBUSB_RC is the release candidate suffix. Should normally be empty. */
#if !defined LIBUSB_RC
#define LIBUSB_RC ""
#endif
