/* config.h.  Generated from config.h.in by configure.  */
/* config.h.in.  Generated from configure.ac by autoheader.  */

/* Define to the attribute for default visibility. */
#define DEFAULT_VISIBILITY __attribute__ ((visibility ("default")))

/* Define to 1 to start with debug message logging enabled. */
/* #undef ENABLE_DEBUG_LOGGING */

/* Define to 1 to enable message logging. */
#define ENABLE_LOGGING 1

/* Define to 1 if you have the <asm/types.h> header file. */
/* #undef HAVE_ASM_TYPES_H */

/* Define to 1 if you have the `clock_gettime' function. */
/* #undef HAVE_CLOCK_GETTIME */

/* Define to 1 if you have the declaration of `EFD_CLOEXEC', and to 0 if you
	don't. */
/* #undef HAVE_DECL_EFD_CLOEXEC */

/* Define to 1 if you have the declaration of `EFD_NONBLOCK', and to 0 if you
	don't. */
/* #undef HAVE_DECL_EFD_NONBLOCK */

/* Define to 1 if you have the declaration of `TFD_CLOEXEC', and to 0 if you
	don't. */
/* #undef HAVE_DECL_TFD_CLOEXEC */

/* Define to 1 if you have the declaration of `TFD_NONBLOCK', and to 0 if you
	don't. */
/* #undef HAVE_DECL_TFD_NONBLOCK */

/* Define to 1 if you have the <dlfcn.h> header file. */
/* #undef HAVE_DLFCN_H */

/* Define to 1 if the system has eventfd functionality. */
/* #undef HAVE_EVENTFD */

/* Define to 1 if you have the <inttypes.h> header file. */
#define HAVE_INTTYPES_H 1

/* Define to 1 if you have the <IOKit/usb/IOUSBHostFamilyDefinitions.h> header
	file. */
/* #undef HAVE_IOKIT_USB_IOUSBHOSTFAMILYDEFINITIONS_H */

/* Define to 1 if you have the `udev' library (-ludev). */
/* #undef HAVE_LIBUDEV */

/* Define to 1 if the system has the type `nfds_t'. */
/* #undef HAVE_NFDS_T */

/* Define to 1 if you have the `pipe2' function. */
/* #undef HAVE_PIPE2 */

/* Define to 1 if you have the `pthread_condattr_setclock' function. */
/* #undef HAVE_PTHREAD_CONDATTR_SETCLOCK */

/* Define to 1 if you have the `pthread_setname_np' function. */
/* #undef HAVE_PTHREAD_SETNAME_NP */

/* Define to 1 if you have the `pthread_threadid_np' function. */
/* #undef HAVE_PTHREAD_THREADID_NP */

/* Define to 1 if you have the <stdint.h> header file. */
#define HAVE_STDINT_H 1

/* Define to 1 if you have the <stdio.h> header file. */
#define HAVE_STDIO_H 1

/* Define to 1 if you have the <stdlib.h> header file. */
#define HAVE_STDLIB_H 1

/* Define to 1 if you have the <strings.h> header file. */
#define HAVE_STRINGS_H 1

/* Define to 1 if you have the <string.h> header file. */
#define HAVE_STRING_H 1

/* Define to 1 if the system has the type `struct timespec'. */
#define HAVE_STRUCT_TIMESPEC 1

/* Define to 1 if you have the `syslog' function. */
/* #undef HAVE_SYSLOG */

/* Define to 1 if you have the <sys/stat.h> header file. */
#define HAVE_SYS_STAT_H 1

/* Define to 1 if you have the <sys/time.h> header file. */
#define HAVE_SYS_TIME_H 1

/* Define to 1 if you have the <sys/types.h> header file. */
#define HAVE_SYS_TYPES_H 1

/* Define to 1 if the system has timerfd functionality. */
/* #undef HAVE_TIMERFD */

/* Define to 1 if you have the <unistd.h> header file. */
#define HAVE_UNISTD_H 1

/* Define to the sub-directory where libtool stores uninstalled libraries. */
#define LT_OBJDIR ".libs/"

/* Name of package */
#define PACKAGE "libusb-1.0"

/* Define to the address where bug reports for this package should be sent. */
#define PACKAGE_BUGREPORT "libusb-devel@lists.sourceforge.net"

/* Define to the full name of this package. */
#define PACKAGE_NAME "libusb-1.0"

/* Define to the full name and version of this package. */
#define PACKAGE_STRING "libusb-1.0 1.0.26"

/* Define to the one symbol short name of this package. */
#define PACKAGE_TARNAME "libusb-1.0"

/* Define to the home page for this package. */
#define PACKAGE_URL "http://libusb.info"

/* Define to the version of this package. */
#define PACKAGE_VERSION "1.0.26"

/* Define to 1 if compiling for a POSIX platform. */
/* #undef PLATFORM_POSIX */

/* Define to 1 if compiling for a Windows platform. */
#define PLATFORM_WINDOWS 1

/* Define to the attribute for enabling parameter checks on printf-like
	functions. */
#define PRINTF_FORMAT(a, b) __attribute__ ((__format__ (__printf__, a, b)))

/* Define to 1 if all of the C90 standard headers exist (not just the ones
	required in a freestanding environment). This macro is provided for
	backward compatibility; new code need not use it. */
#define STDC_HEADERS 1

/* Define to 1 to output logging messages to the systemwide log. */
/* #undef USE_SYSTEM_LOGGING_FACILITY */

/* Version number of package */
#define VERSION "1.0.26"

/* Enable GNU extensions. */
#define _GNU_SOURCE 1

/* Define to the oldest supported Windows version. */
#define _WIN32_WINNT _WIN32_WINNT_VISTA

/* Define to `__inline__' or `__inline' if that's what the C compiler
	calls it, or to nothing if 'inline' is not supported under any name.  */
#if !defined __cplusplus
/* #undef inline */
#endif
