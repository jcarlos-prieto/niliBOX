/* -*- Mode: C; indent-tabs-mode:t ; c-basic-offset:8 -*- */
/*
 * Core functions for libusb
 * Copyright © 2012-2023 Nathan Hjelm <hjelmn@cs.unm.edu>
 * Copyright © 2007-2008 Daniel Drake <dsd@gentoo.org>
 * Copyright © 2001 Johannes Erdfelt <johannes@erdfelt.com>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

#include "libusbi.h"
#include "version.h"

//JC++
#if defined __ANDROID__
   #include "alib.h"
#endif

#if defined __ANDROID__
#include <android/log.h>
#endif
#include <stdio.h>
#include <string.h>
#if defined HAVE_SYSLOG
#include <syslog.h>
#endif

static const struct libusb_version libusb_version_internal =
   { LIBUSB_MAJOR, LIBUSB_MINOR, LIBUSB_MICRO, LIBUSB_NANO,
     LIBUSB_RC, "https://libusb.info" };
static struct timespec timestamp_origin;
#if defined(ENABLE_LOGGING) && !defined(USE_SYSTEM_LOGGING_FACILITY)
static libusb_log_cb log_handler;
#endif

struct libusb_context *usbi_default_context;
struct libusb_context *usbi_fallback_context;
static int default_context_refcnt;
#if defined(ENABLE_LOGGING) && !defined(ENABLE_DEBUG_LOGGING)
static usbi_atomic_t default_debug_level = -1;
#endif
static usbi_mutex_static_t default_context_lock = USBI_MUTEX_INITIALIZER;
static struct usbi_option default_context_options[LIBUSB_OPTION_MAX];


usbi_mutex_static_t active_contexts_lock = USBI_MUTEX_INITIALIZER;
struct list_head active_contexts_list;

/**
 * \mainpage libusb-1.0 API Reference
 *
 * \section intro Introduction
 *
 * libusb is an open source library that allows you to communicate with USB
 * devices from user space. For more info, see the
 * <a href="https://libusb.info">libusb homepage</a>.
 *
 * This documentation is aimed at application developers wishing to
 * communicate with USB peripherals from their own software. After reviewing
 * this documentation, feedback and questions can be sent to the
 * <a href="https://mailing-list.libusb.info">libusb-devel mailing list</a>.
 *
 * This documentation assumes knowledge of how to operate USB devices from
 * a software standpoint (descriptors, configurations, interfaces, endpoints,
 * control/bulk/interrupt/isochronous transfers, etc). Full information
 * can be found in the <a href="http://www.usb.org/developers/docs/">USB 3.0
 * Specification</a> which is available for free download. You can probably
 * find less verbose introductions by searching the web.
 *
 * \section API Application Programming Interface (API)
 *
 * See the \ref libusb_api page for a complete list of the libusb functions.
 *
 * \section features Library features
 *
 * - All transfer types supported (control/bulk/interrupt/isochronous)
 * - 2 transfer interfaces:
 *    -# Synchronous (simple)
 *    -# Asynchronous (more complicated, but more powerful)
 * - Thread safe (although the asynchronous interface means that you
 *   usually won't need to thread)
 * - Lightweight with lean API
 * - Compatible with libusb-0.1 through the libusb-compat-0.1 translation layer
 * - Hotplug support (on some platforms). See \ref libusb_hotplug.
 *
 * \section gettingstarted Getting Started
 *
 * To begin reading the API documentation, start with the Modules page which
 * links to the different categories of libusb's functionality.
 *
 * One decision you will have to make is whether to use the synchronous
 * or the asynchronous data transfer interface. The \ref libusb_io documentation
 * provides some insight into this topic.
 *
 * Some example programs can be found in the libusb source distribution under
 * the "examples" subdirectory. The libusb homepage includes a list of
 * real-life project examples which use libusb.
 *
 * \section errorhandling Error handling
 *
 * libusb functions typically return 0 on success or a negative error code
 * on failure. These negative error codes relate to LIBUSB_ERROR constants
 * which are listed on the \ref libusb_misc "miscellaneous" documentation page.
 *
 * \section msglog Debug message logging
 *
 * libusb uses stderr for all logging. By default, logging is set to NONE,
 * which means that no output will be produced. However, unless the library
 * has been compiled with logging disabled, then any application calls to
 * libusb_set_option(ctx, LIBUSB_OPTION_LOG_LEVEL, level),
 * libusb_init_context, or the setting of the environmental variable
 * LIBUSB_DEBUG outside of the application, can result in logging being
 * produced. Your application should therefore not close stderr, but instead
 * direct it to the null device if its output is undesirable.
 *
 * The libusb_set_option(ctx, LIBUSB_OPTION_LOG_LEVEL, level) or
 * libusb_init_context functions can be used to enable logging of certain
 * messages. With the default configuration, libusb will not log much so if
 * you are advised to use one of these functions to enable all
 * error/warning/informational messages. It will help debug problems with your
 * software.
 *
 * The logged messages are unstructured. There is no one-to-one correspondence
 * between messages being logged and success or failure return codes from
 * libusb functions. There is no format to the messages, so you should not
 * try to capture or parse them. They are not and will not be localized.
 * These messages are not intended to being passed to your application user;
 * instead, you should interpret the error codes returned from libusb functions
 * and provide appropriate notification to the user. The messages are simply
 * there to aid you as a programmer, and if you're confused because you're
 * getting a strange error code from a libusb function, enabling message
 * logging may give you a suitable explanation.
 *
 * The LIBUSB_DEBUG environment variable can be used to enable message logging
 * at run-time. This environment variable should be set to a log level number,
 * which is interpreted the same as the
 * libusb_set_option(ctx, LIBUSB_OPTION_LOG_LEVEL, level), or
 * libusb_init_context(&ctx, &(struct libusb_init_option){.option = LIBUSB_OPTION_LOG_LEVEL, .value = {.ival = level}}, 0).
 * When the environment variable is set, the message logging verbosity level is
 * fixed and setting the LIBUSB_OPTION_LOG_LEVEL option has no effect.
 *
 * libusb can be compiled without any logging functions, useful for embedded
 * systems. In this case, neither the LIBUSB_OPTION_LOG_LEVEL option, nor the
 * LIBUSB_DEBUG environment variable will have any effect.
 *
 * libusb can also be compiled with verbose debugging messages always. When
 * the library is compiled in this way, all messages of all verbosities are
 * always logged. Again, in this case, neither the LIBUSB_OPTION_LOG_LEVEL
 * option, nor the LIBUSB_DEBUG environment variable will have any effect.
 *
 * \section remarks Other remarks
 *
 * libusb does have imperfections. The \ref libusb_caveats "caveats" page attempts
 * to document these.
 */

/**
 * \page libusb_caveats Caveats
 *
 * \section threadsafety Thread safety
 *
 * libusb is designed to be completely thread-safe, but as with any API it
 * cannot prevent a user from sabotaging themselves, either intentionally or
 * otherwise.
 *
 * Observe the following general guidelines:
 *
 * - Calls to functions that release a resource (e.g. libusb_close(),
 *   libusb_free_config_descriptor()) should not be called concurrently on
 *   the same resource. This is no different than concurrently calling free()
 *   on the same allocated pointer.
 * - Each individual \ref libusb_transfer should be prepared by a single
 *   thread. In other words, no two threads should ever be concurrently
 *   filling out the fields of a \ref libusb_transfer. You can liken this to
 *   calling sprintf() with the same destination buffer from multiple threads.
 *   The results will likely not be what you want unless the input parameters
 *   are all the same, but its best to avoid this situation entirely.
 * - Both the \ref libusb_transfer structure and its associated data buffer
 *   should not be accessed between the time the transfer is submitted and the
 *   time the completion callback is invoked. You can think of "ownership" of
 *   these things as being transferred to libusb while the transfer is active.
 * - The various "setter" functions (e.g. libusb_set_log_cb(),
 *   libusb_set_pollfd_notifiers()) should not be called concurrently on the
 *   resource. Though doing so will not lead to any undefined behavior, it
 *   will likely produce results that the application does not expect.
 *
 * Rules for multiple threads and asynchronous I/O are detailed
 * \ref libusb_mtasync "here".
 *
 * \section fork Fork considerations
 *
 * libusb is <em>not</em> designed to work across fork() calls. Depending on
 * the platform, there may be resources in the parent process that are not
 * available to the child (e.g. the hotplug monitor thread on Linux). In
 * addition, since the parent and child will share libusb's internal file
 * descriptors, using libusb in any way from the child could cause the parent
 * process's \ref libusb_context to get into an inconsistent state.
 *
 * On Linux, libusb's file descriptors will be marked as CLOEXEC, which means
 * that it is safe to fork() and exec() without worrying about the child
 * process needing to clean up state or having access to these file descriptors.
 * Other platforms may not be so forgiving, so consider yourself warned!
 *
 * \section devresets Device resets
 *
 * The libusb_reset_device() function allows you to reset a device. If your
 * program has to call such a function, it should obviously be aware that
 * the reset will cause device state to change (e.g. register values may be
 * reset).
 *
 * The problem is that any other program could reset the device your program
 * is working with, at any time. libusb does not offer a mechanism to inform
 * you when this has happened, so if someone else resets your device it will
 * not be clear to your own program why the device state has changed.
 *
 * Ultimately, this is a limitation of writing drivers in user space.
 * Separation from the USB stack in the underlying kernel makes it difficult
 * for the operating system to deliver such notifications to your program.
 * The Linux kernel USB stack allows such reset notifications to be delivered
 * to in-kernel USB drivers, but it is not clear how such notifications could
 * be delivered to second-class drivers that live in user space.
 *
 * \section blockonly Blocking-only functionality
 *
 * The functionality listed below is only available through synchronous,
 * blocking functions. There are no asynchronous/non-blocking alternatives,
 * and no clear ways of implementing these.
 *
 * - Configuration activation (libusb_set_configuration())
 * - Interface/alternate setting activation (libusb_set_interface_alt_setting())
 * - Releasing of interfaces (libusb_release_interface())
 * - Clearing of halt/stall condition (libusb_clear_halt())
 * - Device resets (libusb_reset_device())
 *
 * \section configsel Configuration selection and handling
 *
 * When libusb presents a device handle to an application, there is a chance
 * that the corresponding device may be in unconfigured state. For devices
 * with multiple configurations, there is also a chance that the configuration
 * currently selected is not the one that the application wants to use.
 *
 * The obvious solution is to add a call to libusb_set_configuration() early
 * on during your device initialization routines, but there are caveats to
 * be aware of:
 * -# If the device is already in the desired configuration, calling
 *    libusb_set_configuration() using the same configuration value will cause
 *    a lightweight device reset. This may not be desirable behaviour.
 * -# In the case where the desired configuration is already active, libusb
 *    may not even be able to perform a lightweight device reset. For example,
 *    take my USB keyboard with fingerprint reader: I'm interested in driving
 *    the fingerprint reader interface through libusb, but the kernel's
 *    USB-HID driver will almost always have claimed the keyboard interface.
 *    Because the kernel has claimed an interface, it is not even possible to
 *    perform the lightweight device reset, so libusb_set_configuration() will
 *    fail. (Luckily the device in question only has a single configuration.)
 * -# libusb will be unable to set a configuration if other programs or
 *    drivers have claimed interfaces. In particular, this means that kernel
 *    drivers must be detached from all the interfaces before
 *    libusb_set_configuration() may succeed.
 *
 * One solution to some of the above problems is to consider the currently
 * active configuration. If the configuration we want is already active, then
 * we don't have to select any configuration:
\code
cfg = -1;
libusb_get_configuration(dev, &cfg);
if (cfg != desired)
   libusb_set_configuration(dev, desired);
\endcode
 *
 * This is probably suitable for most scenarios, but is inherently racy:
 * another application or driver may change the selected configuration
 * <em>after</em> the libusb_get_configuration() call.
 *
 * Even in cases where libusb_set_configuration() succeeds, consider that other
 * applications or drivers may change configuration after your application
 * calls libusb_set_configuration().
 *
 * One possible way to lock your device into a specific configuration is as
 * follows:
 * -# Set the desired configuration (or use the logic above to realise that
 *    it is already in the desired configuration)
 * -# Claim the interface that you wish to use
 * -# Check that the currently active configuration is the one that you want
 *    to use.
 *
 * The above method works because once an interface is claimed, no application
 * or driver is able to select another configuration.
 *
 * \section earlycomp Early transfer completion
 *
 * NOTE: This section is currently Linux-centric. I am not sure if any of these
 * considerations apply to Darwin or other platforms.
 *
 * When a transfer completes early (i.e. when less data is received/sent in
 * any one packet than the transfer buffer allows for) then libusb is designed
 * to terminate the transfer immediately, not transferring or receiving any
 * more data unless other transfers have been queued by the user.
 *
 * On legacy platforms, libusb is unable to do this in all situations. After
 * the incomplete packet occurs, "surplus" data may be transferred. For recent
 * versions of libusb, this information is kept (the data length of the
 * transfer is updated) and, for device-to-host transfers, any surplus data was
 * added to the buffer. Still, this is not a nice solution because it loses the
 * information about the end of the short packet, and the user probably wanted
 * that surplus data to arrive in the next logical transfer.
 *
 * \section zlp Zero length packets
 *
 * - libusb is able to send a packet of zero length to an endpoint simply by
 * submitting a transfer of zero length.
 * - The \ref libusb_transfer_flags::LIBUSB_TRANSFER_ADD_ZERO_PACKET
 * "LIBUSB_TRANSFER_ADD_ZERO_PACKET" flag is currently supported on Linux,
 * Darwin and Windows (WinUSB).
 */

/**
 * \page libusb_contexts Contexts
 *
 * It is possible that libusb may be used simultaneously from two independent
 * libraries linked into the same executable. For example, if your application
 * has a plugin-like system which allows the user to dynamically load a range
 * of modules into your program, it is feasible that two independently
 * developed modules may both use libusb.
 *
 * libusb is written to allow for these multiple user scenarios. The two
 * "instances" of libusb will not interfere: an option set by one user will have
 * no effect the same option for other users, other users can continue using
 * libusb after one of them calls libusb_exit(), etc.
 *
 * This is made possible through libusb's <em>context</em> concept. When you
 * call libusb_init_context(), you are (optionally) given a context. You can then pass
 * this context pointer back into future libusb functions.
 *
 * In order to keep things simple for more simplistic applications, it is
 * legal to pass NULL to all functions requiring a context pointer (as long as
 * you're sure no other code will attempt to use libusb from the same process).
 * When you pass NULL, the default context will be used. The default context
 * is created the first time a process calls libusb_init_context() when no other
 * context is alive. Contexts are destroyed during libusb_exit().
 *
 * The default context is reference-counted and can be shared. That means that
 * if libusb_init_context(NULL, x, y) is called twice within the same process, the two
 * users end up sharing the same context. The deinitialization and freeing of
 * the default context will only happen when the last user calls libusb_exit().
 * In other words, the default context is created and initialized when its
 * reference count goes from 0 to 1, and is deinitialized and destroyed when
 * its reference count goes from 1 to 0.
 *
 * You may be wondering why only a subset of libusb functions require a
 * context pointer in their function definition. Internally, libusb stores
 * context pointers in other objects (e.g. libusb_device instances) and hence
 * can infer the context from those objects.
 */

 /**
  * \page libusb_api Application Programming Interface
  *
  * This is the complete list of libusb functions, structures and
  * enumerations in alphabetical order.
  *
  * \section Functions
  * - libusb_alloc_streams()
  * - libusb_alloc_transfer()
  * - libusb_attach_kernel_driver()
  * - libusb_bulk_transfer()
  * - libusb_cancel_transfer()
  * - libusb_claim_interface()
  * - libusb_clear_halt()
  * - libusb_close()
  * - libusb_control_transfer()
  * - libusb_control_transfer_get_data()
  * - libusb_control_transfer_get_setup()
  * - libusb_cpu_to_le16()
  * - libusb_detach_kernel_driver()
  * - libusb_dev_mem_alloc()
  * - libusb_dev_mem_free()
  * - libusb_error_name()
  * - libusb_event_handler_active()
  * - libusb_event_handling_ok()
  * - libusb_exit()
  * - libusb_fill_bulk_stream_transfer()
  * - libusb_fill_bulk_transfer()
  * - libusb_fill_control_setup()
  * - libusb_fill_control_transfer()
  * - libusb_fill_interrupt_transfer()
  * - libusb_fill_iso_transfer()
  * - libusb_free_bos_descriptor()
  * - libusb_free_config_descriptor()
  * - libusb_free_container_id_descriptor()
  * - libusb_free_device_list()
  * - libusb_free_pollfds()
  * - libusb_free_ss_endpoint_companion_descriptor()
  * - libusb_free_ss_usb_device_capability_descriptor()
  * - libusb_free_streams()
  * - libusb_free_transfer()
  * - libusb_free_usb_2_0_extension_descriptor()
  * - libusb_get_active_config_descriptor()
  * - libusb_get_bos_descriptor()
  * - libusb_get_bus_number()
  * - libusb_get_config_descriptor()
  * - libusb_get_config_descriptor_by_value()
  * - libusb_get_configuration()
  * - libusb_get_container_id_descriptor()
  * - libusb_get_descriptor()
  * - libusb_get_device()
  * - libusb_get_device_address()
  * - libusb_get_device_descriptor()
  * - libusb_get_device_list()
  * - libusb_get_device_speed()
  * - libusb_get_iso_packet_buffer()
  * - libusb_get_iso_packet_buffer_simple()
  * - libusb_get_max_alt_packet_size()
  * - libusb_get_max_iso_packet_size()
  * - libusb_get_max_packet_size()
  * - libusb_get_next_timeout()
  * - libusb_get_parent()
  * - libusb_get_pollfds()
  * - libusb_get_port_number()
  * - libusb_get_port_numbers()
  * - libusb_get_port_path()
  * - libusb_get_ss_endpoint_companion_descriptor()
  * - libusb_get_ss_usb_device_capability_descriptor()
  * - libusb_get_string_descriptor()
  * - libusb_get_string_descriptor_ascii()
  * - libusb_get_usb_2_0_extension_descriptor()
  * - libusb_get_version()
  * - libusb_handle_events()
  * - libusb_handle_events_completed()
  * - libusb_handle_events_locked()
  * - libusb_handle_events_timeout()
  * - libusb_handle_events_timeout_completed()
  * - libusb_has_capability()
  * - libusb_hotplug_deregister_callback()
  * - libusb_hotplug_register_callback()
  * - libusb_init()
  * - libusb_init_context()
  * - libusb_interrupt_event_handler()
  * - libusb_interrupt_transfer()
  * - libusb_kernel_driver_active()
  * - libusb_lock_events()
  * - libusb_lock_event_waiters()
  * - libusb_open()
  * - libusb_open_device_with_vid_pid()
  * - libusb_pollfds_handle_timeouts()
  * - libusb_ref_device()
  * - libusb_release_interface()
  * - libusb_reset_device()
  * - libusb_set_auto_detach_kernel_driver()
  * - libusb_set_configuration()
  * - libusb_set_debug()
  * - libusb_set_log_cb()
  * - libusb_set_interface_alt_setting()
  * - libusb_set_iso_packet_lengths()
  * - libusb_set_option()
  * - libusb_setlocale()
  * - libusb_set_pollfd_notifiers()
  * - libusb_strerror()
  * - libusb_submit_transfer()
  * - libusb_transfer_get_stream_id()
  * - libusb_transfer_set_stream_id()
  * - libusb_try_lock_events()
  * - libusb_unlock_events()
  * - libusb_unlock_event_waiters()
  * - libusb_unref_device()
  * - libusb_wait_for_event()
  * - libusb_wrap_sys_device()
  *
  * \section Structures
  * - libusb_bos_descriptor
  * - libusb_bos_dev_capability_descriptor
  * - libusb_config_descriptor
  * - libusb_container_id_descriptor
  * - \ref libusb_context
  * - libusb_control_setup
  * - \ref libusb_device
  * - libusb_device_descriptor
  * - \ref libusb_device_handle
  * - libusb_endpoint_descriptor
  * - libusb_interface
  * - libusb_interface_descriptor
  * - libusb_iso_packet_descriptor
  * - libusb_pollfd
  * - libusb_ss_endpoint_companion_descriptor
  * - libusb_ss_usb_device_capability_descriptor
  * - libusb_transfer
  * - libusb_usb_2_0_extension_descriptor
  * - libusb_version
  *
  * \section Enums
  * - \ref libusb_bos_type
  * - \ref libusb_capability
  * - \ref libusb_class_code
  * - \ref libusb_descriptor_type
  * - \ref libusb_endpoint_direction
  * - \ref libusb_endpoint_transfer_type
  * - \ref libusb_error
  * - \ref libusb_iso_sync_type
  * - \ref libusb_iso_usage_type
  * - \ref libusb_log_level
  * - \ref libusb_option
  * - \ref libusb_request_recipient
  * - \ref libusb_request_type
  * - \ref libusb_speed
  * - \ref libusb_ss_usb_device_capability_attributes
  * - \ref libusb_standard_request
  * - \ref libusb_supported_speed
  * - \ref libusb_transfer_flags
  * - \ref libusb_transfer_status
  * - \ref libusb_transfer_type
  * - \ref libusb_usb_2_0_extension_attributes
  */

/**
 * @defgroup libusb_lib Library initialization/deinitialization
 * This page details how to initialize and deinitialize libusb. Initialization
 * must be performed before using any libusb functionality, and similarly you
 * must not call any libusb functions after deinitialization.
 */

/**
 * @defgroup libusb_dev Device handling and enumeration
 * The functionality documented below is designed to help with the following
 * operations:
 * - Enumerating the USB devices currently attached to the system
 * - Choosing a device to operate from your software
 * - Opening and closing the chosen device
 *
 * \section nutshell In a nutshell...
 *
 * The description below really makes things sound more complicated than they
 * actually are. The following sequence of function calls will be suitable
 * for almost all scenarios and does not require you to have such a deep
 * understanding of the resource management issues:
 * \code
// discover devices
libusb_device **list;
libusb_device *found = NULL;
ssize_t cnt = libusb_get_device_list(NULL, &list);
ssize_t i = 0;
int err = 0;
if (cnt < 0)
   error();

for (i = 0; i < cnt; i++) {
   libusb_device *device = list[i];
   if (is_interesting(device)) {
      found = device;
      break;
   }
}

if (found) {
   libusb_device_handle *handle;

   err = libusb_open(found, &handle);
   if (err)
      error();
   // etc
}

libusb_free_device_list(list, 1);
\endcode
 *
 * The two important points:
 * - You asked libusb_free_device_list() to unreference the devices (2nd
 *   parameter)
 * - You opened the device before freeing the list and unreferencing the
 *   devices
 *
 * If you ended up with a handle, you can now proceed to perform I/O on the
 * device.
 *
 * \section devshandles Devices and device handles
 * libusb has a concept of a USB device, represented by the
 * \ref libusb_device opaque type. A device represents a USB device that
 * is currently or was previously connected to the system. Using a reference
 * to a device, you can determine certain information about the device (e.g.
 * you can read the descriptor data).
 *
 * The libusb_get_device_list() function can be used to obtain a list of
 * devices currently connected to the system. This is known as device
 * discovery. Devices can also be discovered with the hotplug mechanism,
 * whereby a callback function registered with libusb_hotplug_register_callback()
 * will be called when a device of interest is connected or disconnected.
 *
 * Just because you have a reference to a device does not mean it is
 * necessarily usable. The device may have been unplugged, you may not have
 * permission to operate such device, or another program or driver may be
 * using the device.
 *
 * When you've found a device that you'd like to operate, you must ask
 * libusb to open the device using the libusb_open() function. Assuming
 * success, libusb then returns you a <em>device handle</em>
 * (a \ref libusb_device_handle pointer). All "real" I/O operations then
 * operate on the handle rather than the original device pointer.
 *
 * \section devref Device discovery and reference counting
 *
 * Device discovery (i.e. calling libusb_get_device_list()) returns a
 * freshly-allocated list of devices. The list itself must be freed when
 * you are done with it. libusb also needs to know when it is OK to free
 * the contents of the list - the devices themselves.
 *
 * To handle these issues, libusb provides you with two separate items:
 * - A function to free the list itself
 * - A reference counting system for the devices inside
 *
 * New devices presented by the libusb_get_device_list() function all have a
 * reference count of 1. You can increase and decrease reference count using
 * libusb_ref_device() and libusb_unref_device(). A device is destroyed when
 * its reference count reaches 0.
 *
 * With the above information in mind, the process of opening a device can
 * be viewed as follows:
 * -# Discover devices using libusb_get_device_list() or libusb_hotplug_register_callback().
 * -# Choose the device that you want to operate, and call libusb_open().
 * -# Unref all devices in the discovered device list.
 * -# Free the discovered device list.
 *
 * The order is important - you must not unreference the device before
 * attempting to open it, because unreferencing it may destroy the device.
 *
 * For convenience, the libusb_free_device_list() function includes a
 * parameter to optionally unreference all the devices in the list before
 * freeing the list itself. This combines steps 3 and 4 above.
 *
 * As an implementation detail, libusb_open() actually adds a reference to
 * the device in question. This is because the device remains available
 * through the handle via libusb_get_device(). The reference is deleted during
 * libusb_close().
 */

/** @defgroup libusb_misc Miscellaneous */

/* we traverse usbfs without knowing how many devices we are going to find.
 * so we create this discovered_devs model which is similar to a linked-list
 * which grows when required. it can be freed once discovery has completed,
 * eliminating the need for a list node in the libusb_device structure
 * itself. */
#define DISCOVERED_DEVICES_SIZE_STEP 16

static struct discovered_devs *discovered_devs_alloc(void)
{
   struct discovered_devs *ret =
      malloc(sizeof(*ret) + (sizeof(void *) * DISCOVERED_DEVICES_SIZE_STEP));

   if (ret) {
      ret->len = 0;
      ret->capacity = DISCOVERED_DEVICES_SIZE_STEP;
   }
   return ret;
}

static void discovered_devs_free(struct discovered_devs *discdevs)
{
   size_t i;

   for (i = 0; i < discdevs->len; i++)
      libusb_unref_device(discdevs->devices[i]);

   free(discdevs);
}

/* append a device to the discovered devices collection. may realloc itself,
 * returning new discdevs. returns NULL on realloc failure. */
struct discovered_devs *discovered_devs_append(
   struct discovered_devs *discdevs, struct libusb_device *dev)
{
   size_t len = discdevs->len;
   size_t capacity;
   struct discovered_devs *new_discdevs;

   /* if there is space, just append the device */
   if (len < discdevs->capacity) {
      discdevs->devices[len] = libusb_ref_device(dev);
      discdevs->len++;
      return discdevs;
   }

   /* exceeded capacity, need to grow */
   usbi_dbg(DEVICE_CTX(dev), "need to increase capacity");
   capacity = discdevs->capacity + DISCOVERED_DEVICES_SIZE_STEP;
   /* can't use usbi_reallocf here because in failure cases it would
    * free the existing discdevs without unreferencing its devices. */
   new_discdevs = realloc(discdevs,
      sizeof(*discdevs) + (sizeof(void *) * capacity));
   if (!new_discdevs) {
      discovered_devs_free(discdevs);
      return NULL;
   }

   discdevs = new_discdevs;
   discdevs->capacity = capacity;
   discdevs->devices[len] = libusb_ref_device(dev);
   discdevs->len++;

   return discdevs;
}

/* Allocate a new device with a specific session ID. The returned device has
 * a reference count of 1. */
struct libusb_device *usbi_alloc_device(struct libusb_context *ctx,
   unsigned long session_id)
{
   size_t priv_size = usbi_backend.device_priv_size;
   struct libusb_device *dev = calloc(1, PTR_ALIGN(sizeof(*dev)) + priv_size);

   if (!dev)
      return NULL;

   usbi_atomic_store(&dev->refcnt, 1);

   dev->ctx = ctx;
   dev->session_data = session_id;
   dev->speed = LIBUSB_SPEED_UNKNOWN;

   if (!libusb_has_capability(LIBUSB_CAP_HAS_HOTPLUG))
      usbi_connect_device(dev);

   return dev;
}

void usbi_connect_device(struct libusb_device *dev)
{
   struct libusb_context *ctx = DEVICE_CTX(dev);

   usbi_atomic_store(&dev->attached, 1);

   usbi_mutex_lock(&dev->ctx->usb_devs_lock);
   list_add(&dev->list, &dev->ctx->usb_devs);
   usbi_mutex_unlock(&dev->ctx->usb_devs_lock);

   usbi_hotplug_notification(ctx, dev, LIBUSB_HOTPLUG_EVENT_DEVICE_ARRIVED);
}

void usbi_disconnect_device(struct libusb_device *dev)
{
   struct libusb_context *ctx = DEVICE_CTX(dev);

   usbi_atomic_store(&dev->attached, 0);

   usbi_mutex_lock(&ctx->usb_devs_lock);
   list_del(&dev->list);
   usbi_mutex_unlock(&ctx->usb_devs_lock);

   usbi_hotplug_notification(ctx, dev, LIBUSB_HOTPLUG_EVENT_DEVICE_LEFT);
}

/* Perform some final sanity checks on a newly discovered device. If this
 * function fails (negative return code), the device should not be added
 * to the discovered device list. */
int usbi_sanitize_device(struct libusb_device *dev)
{
   uint8_t num_configurations;

   if (dev->device_descriptor.bLength != LIBUSB_DT_DEVICE_SIZE ||
       dev->device_descriptor.bDescriptorType != LIBUSB_DT_DEVICE) {
      usbi_err(DEVICE_CTX(dev), "invalid device descriptor");
      return LIBUSB_ERROR_IO;
   }

   num_configurations = dev->device_descriptor.bNumConfigurations;
   if (num_configurations > USB_MAXCONFIG) {
      usbi_err(DEVICE_CTX(dev), "too many configurations");
      return LIBUSB_ERROR_IO;
   } else if (0 == num_configurations) {
      usbi_dbg(DEVICE_CTX(dev), "zero configurations, maybe an unauthorized device");
   }

   return 0;
}

/* Examine libusb's internal list of known devices, looking for one with
 * a specific session ID. Returns the matching device if it was found, and
 * NULL otherwise. */
struct libusb_device *usbi_get_device_by_session_id(struct libusb_context *ctx,
   unsigned long session_id)
{
   struct libusb_device *dev;
   struct libusb_device *ret = NULL;

   usbi_mutex_lock(&ctx->usb_devs_lock);
   for_each_device(ctx, dev) {
      if (dev->session_data == session_id) {
         ret = libusb_ref_device(dev);
         break;
      }
   }
   usbi_mutex_unlock(&ctx->usb_devs_lock);

   return ret;
}

/** @ingroup libusb_dev
 * Returns a list of USB devices currently attached to the system. This is
 * your entry point into finding a USB device to operate.
 *
 * You are expected to unreference all the devices when you are done with
 * them, and then free the list with libusb_free_device_list(). Note that
 * libusb_free_device_list() can unref all the devices for you. Be careful
 * not to unreference a device you are about to open until after you have
 * opened it.
 *
 * This return value of this function indicates the number of devices in
 * the resultant list. The list is actually one element larger, as it is
 * NULL-terminated.
 *
 * \param ctx the context to operate on, or NULL for the default context
 * \param list output location for a list of devices. Must be later freed with
 * libusb_free_device_list().
 * \returns the number of devices in the outputted list, or any
 * \ref libusb_error according to errors encountered by the backend.
 */
ssize_t API_EXPORTED libusb_get_device_list(libusb_context *ctx,
   libusb_device ***list)
{
//JC++
#if defined __ANDROID__
    return alibusb_get_device_list(ctx, list);
#endif
   struct discovered_devs *discdevs = discovered_devs_alloc();
   struct libusb_device **ret;
   int r = 0;
   ssize_t i, len;

   usbi_dbg(ctx, " ");

   if (!discdevs)
      return LIBUSB_ERROR_NO_MEM;

   ctx = usbi_get_context(ctx);

   if (libusb_has_capability(LIBUSB_CAP_HAS_HOTPLUG)) {
      /* backend provides hotplug support */
      struct libusb_device *dev;

      if (usbi_backend.hotplug_poll)
         usbi_backend.hotplug_poll();

      usbi_mutex_lock(&ctx->usb_devs_lock);
      for_each_device(ctx, dev) {
         discdevs = discovered_devs_append(discdevs, dev);

         if (!discdevs) {
            r = LIBUSB_ERROR_NO_MEM;
            break;
         }
      }
      usbi_mutex_unlock(&ctx->usb_devs_lock);
   } else {
      /* backend does not provide hotplug support */
      r = usbi_backend.get_device_list(ctx, &discdevs);
   }

   if (r < 0) {
      len = r;
      goto out;
   }

   /* convert discovered_devs into a list */
   len = (ssize_t)discdevs->len;
   ret = calloc((size_t)len + 1, sizeof(struct libusb_device *));
   if (!ret) {
      len = LIBUSB_ERROR_NO_MEM;
      goto out;
   }

   ret[len] = NULL;
   for (i = 0; i < len; i++) {
      struct libusb_device *dev = discdevs->devices[i];
      ret[i] = libusb_ref_device(dev);
   }
   *list = ret;

out:
   if (discdevs)
      discovered_devs_free(discdevs);
   return len;
}

/** \ingroup libusb_dev
 * Frees a list of devices previously discovered using
 * libusb_get_device_list(). If the unref_devices parameter is set, the
 * reference count of each device in the list is decremented by 1.
 * \param list the list to free
 * \param unref_devices whether to unref the devices in the list
 */
void API_EXPORTED libusb_free_device_list(libusb_device **list,
   int unref_devices)
{
   if (!list)
      return;

   if (unref_devices) {
      int i = 0;
      struct libusb_device *dev;

      while ((dev = list[i++]) != NULL)
         libusb_unref_device(dev);
   }
   free(list);
}

/** \ingroup libusb_dev
 * Get the number of the bus that a device is connected to.
 * \param dev a device
 * \returns the bus number
 */
uint8_t API_EXPORTED libusb_get_bus_number(libusb_device *dev)
{
   return dev->bus_number;
}

/** \ingroup libusb_dev
 * Get the number of the port that a device is connected to.
 * Unless the OS does something funky, or you are hot-plugging USB extension cards,
 * the port number returned by this call is usually guaranteed to be uniquely tied
 * to a physical port, meaning that different devices plugged on the same physical
 * port should return the same port number.
 *
 * But outside of this, there is no guarantee that the port number returned by this
 * call will remain the same, or even match the order in which ports have been
 * numbered by the HUB/HCD manufacturer.
 *
 * \param dev a device
 * \returns the port number (0 if not available)
 */
uint8_t API_EXPORTED libusb_get_port_number(libusb_device *dev)
{
   return dev->port_number;
}

/** \ingroup libusb_dev
 * Get the list of all port numbers from root for the specified device
 *
 * Since version 1.0.16, \ref LIBUSBX_API_VERSION >= 0x01000102
 * \param dev a device
 * \param port_numbers the array that should contain the port numbers
 * \param port_numbers_len the maximum length of the array. As per the USB 3.0
 * specs, the current maximum limit for the depth is 7.
 * \returns the number of elements filled
 * \returns \ref LIBUSB_ERROR_OVERFLOW if the array is too small
 */
int API_EXPORTED libusb_get_port_numbers(libusb_device *dev,
   uint8_t *port_numbers, int port_numbers_len)
{
   int i = port_numbers_len;
   struct libusb_context *ctx = DEVICE_CTX(dev);

   if (port_numbers_len <= 0)
      return LIBUSB_ERROR_INVALID_PARAM;

   // HCDs can be listed as devices with port #0
   while((dev) && (dev->port_number != 0)) {
      if (--i < 0) {
         usbi_warn(ctx, "port numbers array is too small");
         return LIBUSB_ERROR_OVERFLOW;
      }
      port_numbers[i] = dev->port_number;
      dev = dev->parent_dev;
   }
   if (i < port_numbers_len)
      memmove(port_numbers, &port_numbers[i], port_numbers_len - i);
   return port_numbers_len - i;
}

/** \ingroup libusb_dev
 * \deprecated Please use \ref libusb_get_port_numbers() instead.
 */
int API_EXPORTED libusb_get_port_path(libusb_context *ctx, libusb_device *dev,
   uint8_t *port_numbers, uint8_t port_numbers_len)
{
   UNUSED(ctx);

   return libusb_get_port_numbers(dev, port_numbers, port_numbers_len);
}

/** \ingroup libusb_dev
 * Get the the parent from the specified device.
 * \param dev a device
 * \returns the device parent or NULL if not available
 * You should issue a \ref libusb_get_device_list() before calling this
 * function and make sure that you only access the parent before issuing
 * \ref libusb_free_device_list(). The reason is that libusb currently does
 * not maintain a permanent list of device instances, and therefore can
 * only guarantee that parents are fully instantiated within a
 * libusb_get_device_list() - libusb_free_device_list() block.
 */
DEFAULT_VISIBILITY
libusb_device * LIBUSB_CALL libusb_get_parent(libusb_device *dev)
{
   return dev->parent_dev;
}

/** \ingroup libusb_dev
 * Get the address of the device on the bus it is connected to.
 * \param dev a device
 * \returns the device address
 */
uint8_t API_EXPORTED libusb_get_device_address(libusb_device *dev)
{
   return dev->device_address;
}

/** \ingroup libusb_dev
 * Get the negotiated connection speed for a device.
 * \param dev a device
 * \returns a \ref libusb_speed code, where LIBUSB_SPEED_UNKNOWN means that
 * the OS doesn't know or doesn't support returning the negotiated speed.
 */
int API_EXPORTED libusb_get_device_speed(libusb_device *dev)
{
   return dev->speed;
}

static const struct libusb_endpoint_descriptor *find_endpoint(
   struct libusb_config_descriptor *config, unsigned char endpoint)
{
   int iface_idx;
   for (iface_idx = 0; iface_idx < config->bNumInterfaces; iface_idx++) {
      const struct libusb_interface *iface = &config->interface[iface_idx];
      int altsetting_idx;

      for (altsetting_idx = 0; altsetting_idx < iface->num_altsetting;
            altsetting_idx++) {
         const struct libusb_interface_descriptor *altsetting
            = &iface->altsetting[altsetting_idx];
         int ep_idx;

         for (ep_idx = 0; ep_idx < altsetting->bNumEndpoints; ep_idx++) {
            const struct libusb_endpoint_descriptor *ep =
               &altsetting->endpoint[ep_idx];
            if (ep->bEndpointAddress == endpoint)
               return ep;
         }
      }
   }
   return NULL;
}

/** \ingroup libusb_dev
 * Convenience function to retrieve the wMaxPacketSize value for a particular
 * endpoint in the active device configuration.
 *
 * This function was originally intended to be of assistance when setting up
 * isochronous transfers, but a design mistake resulted in this function
 * instead. It simply returns the wMaxPacketSize value without considering
 * its contents. If you're dealing with isochronous transfers, you probably
 * want libusb_get_max_iso_packet_size() instead.
 *
 * \param dev a device
 * \param endpoint address of the endpoint in question
 * \returns the wMaxPacketSize value
 * \returns \ref LIBUSB_ERROR_NOT_FOUND if the endpoint does not exist
 * \returns \ref LIBUSB_ERROR_OTHER on other failure
 */
int API_EXPORTED libusb_get_max_packet_size(libusb_device *dev,
   unsigned char endpoint)
{
   struct libusb_config_descriptor *config;
   const struct libusb_endpoint_descriptor *ep;
   int r;

   r = libusb_get_active_config_descriptor(dev, &config);
   if (r < 0) {
      usbi_err(DEVICE_CTX(dev),
         "could not retrieve active config descriptor");
      return LIBUSB_ERROR_OTHER;
   }

   ep = find_endpoint(config, endpoint);
   if (!ep) {
      r = LIBUSB_ERROR_NOT_FOUND;
      goto out;
   }

   r = ep->wMaxPacketSize;

out:
   libusb_free_config_descriptor(config);
   return r;
}

static const struct libusb_endpoint_descriptor *find_alt_endpoint(
   struct libusb_config_descriptor *config,
   int iface_idx, int altsetting_idx, unsigned char endpoint)
{
   if (iface_idx >= config->bNumInterfaces) {
      return NULL;
   }

   const struct libusb_interface *iface = &config->interface[iface_idx];

   if (altsetting_idx >= iface->num_altsetting) {
      return NULL;
   }

   const struct libusb_interface_descriptor *altsetting
      = &iface->altsetting[altsetting_idx];
   int ep_idx;

   for (ep_idx = 0; ep_idx < altsetting->bNumEndpoints; ep_idx++) {
      const struct libusb_endpoint_descriptor *ep =
         &altsetting->endpoint[ep_idx];
      if (ep->bEndpointAddress == endpoint)
         return ep;
   }
   return NULL;
}

static int get_endpoint_max_packet_size(libusb_device *dev,
   const struct libusb_endpoint_descriptor *ep)
{
   struct libusb_ss_endpoint_companion_descriptor *ss_ep_cmp;
   enum libusb_endpoint_transfer_type ep_type;
   uint16_t val;
   int r = 0;
   int speed;

   speed = libusb_get_device_speed(dev);
   if (speed >= LIBUSB_SPEED_SUPER) {
      r = libusb_get_ss_endpoint_companion_descriptor(dev->ctx, ep, &ss_ep_cmp);
      if (r == LIBUSB_SUCCESS) {
         r = ss_ep_cmp->wBytesPerInterval;
         libusb_free_ss_endpoint_companion_descriptor(ss_ep_cmp);
      }
   }

   /* If the device isn't a SuperSpeed device or retrieving the SS endpoint didn't worked. */
   if (speed < LIBUSB_SPEED_SUPER || r < 0) {
      val = ep->wMaxPacketSize;
      ep_type = (enum libusb_endpoint_transfer_type) (ep->bmAttributes & 0x3);

      r = val & 0x07ff;
      if (ep_type == LIBUSB_ENDPOINT_TRANSFER_TYPE_ISOCHRONOUS
          || ep_type == LIBUSB_ENDPOINT_TRANSFER_TYPE_INTERRUPT)
         r *= (1 + ((val >> 11) & 3));
   }

   return r;
}

/** \ingroup libusb_dev
 * Calculate the maximum packet size which a specific endpoint is capable is
 * sending or receiving in the duration of 1 microframe
 *
 * Only the active configuration is examined. The calculation is based on the
 * wMaxPacketSize field in the endpoint descriptor as described in section
 * 9.6.6 in the USB 2.0 specifications.
 *
 * If acting on an isochronous or interrupt endpoint, this function will
 * multiply the value found in bits 0:10 by the number of transactions per
 * microframe (determined by bits 11:12). Otherwise, this function just
 * returns the numeric value found in bits 0:10. For USB 3.0 device, it
 * will attempts to retrieve the Endpoint Companion Descriptor to return
 * wBytesPerInterval.
 *
 * This function is useful for setting up isochronous transfers, for example
 * you might pass the return value from this function to
 * libusb_set_iso_packet_lengths() in order to set the length field of every
 * isochronous packet in a transfer.
 *
 * This function only considers the first alternate setting of the interface.
 * If the endpoint has different maximum packet sizes for different alternate
 * settings, you probably want libusb_get_max_alt_packet_size() instead.
 *
 * Since v1.0.3.
 *
 * \param dev a device
 * \param endpoint address of the endpoint in question
 * \returns the maximum packet size which can be sent/received on this endpoint
 * \returns \ref LIBUSB_ERROR_NOT_FOUND if the endpoint does not exist
 * \returns \ref LIBUSB_ERROR_OTHER on other failure
 * \see libusb_get_max_alt_packet_size
 */
int API_EXPORTED libusb_get_max_iso_packet_size(libusb_device *dev,
   unsigned char endpoint)
{
   struct libusb_config_descriptor *config;
   const struct libusb_endpoint_descriptor *ep;
   int r;

   r = libusb_get_active_config_descriptor(dev, &config);
   if (r < 0) {
      usbi_err(DEVICE_CTX(dev),
         "could not retrieve active config descriptor");
      return LIBUSB_ERROR_OTHER;
   }

   ep = find_endpoint(config, endpoint);
   if (!ep) {
      r = LIBUSB_ERROR_NOT_FOUND;
      goto out;
   }

   r = get_endpoint_max_packet_size(dev, ep);

out:
   libusb_free_config_descriptor(config);
   return r;
}

/** \ingroup libusb_dev
 * Calculate the maximum packet size which a specific endpoint is capable of
 * sending or receiving in the duration of 1 microframe
 *
 * Only the active configuration is examined. The calculation is based on the
 * wMaxPacketSize field in the endpoint descriptor as described in section
 * 9.6.6 in the USB 2.0 specifications.
 *
 * If acting on an isochronous or interrupt endpoint, this function will
 * multiply the value found in bits 0:10 by the number of transactions per
 * microframe (determined by bits 11:12). Otherwise, this function just
 * returns the numeric value found in bits 0:10. For USB 3.0 device, it
 * will attempts to retrieve the Endpoint Companion Descriptor to return
 * wBytesPerInterval.
 *
 * This function is useful for setting up isochronous transfers, for example
 * you might pass the return value from this function to
 * libusb_set_iso_packet_lengths() in order to set the length field of every
 * isochronous packet in a transfer.
 *
 * Since version 1.0.27, \ref LIBUSB_API_VERSION >= 0x0100010A
 *
 * \param dev a device
 * \param interface_number the <tt>bInterfaceNumber</tt> of the interface
 * the endpoint belongs to
 * \param alternate_setting the <tt>bAlternateSetting</tt> of the interface
 * \param endpoint address of the endpoint in question
 * \returns the maximum packet size which can be sent/received on this endpoint
 * \returns \ref LIBUSB_ERROR_NOT_FOUND if the endpoint does not exist
 * \returns \ref LIBUSB_ERROR_OTHER on other failure
 * \see libusb_get_max_iso_packet_size
 */
int API_EXPORTED libusb_get_max_alt_packet_size(libusb_device *dev,
   int interface_number, int alternate_setting, unsigned char endpoint)
{
   struct libusb_config_descriptor *config;
   const struct libusb_endpoint_descriptor *ep;
   int r;

   r = libusb_get_active_config_descriptor(dev, &config);
   if (r < 0) {
      usbi_err(DEVICE_CTX(dev),
         "could not retrieve active config descriptor");
      return LIBUSB_ERROR_OTHER;
   }

   ep = find_alt_endpoint(config, interface_number,
      alternate_setting, endpoint);
   if (!ep) {
      r = LIBUSB_ERROR_NOT_FOUND;
      goto out;
   }

   r = get_endpoint_max_packet_size(dev, ep);

out:
   libusb_free_config_descriptor(config);
   return r;
}

/** \ingroup libusb_dev
 * Increment the reference count of a device.
 * \param dev the device to reference
 * \returns the same device
 */
DEFAULT_VISIBILITY
libusb_device * LIBUSB_CALL libusb_ref_device(libusb_device *dev)
{
   long refcnt;

   refcnt = usbi_atomic_inc(&dev->refcnt);
   assert(refcnt >= 2);

   return dev;
}

/** \ingroup libusb_dev
 * Decrement the reference count of a device. If the decrement operation
 * causes the reference count to reach zero, the device shall be destroyed.
 * \param dev the device to unreference
 */
void API_EXPORTED libusb_unref_device(libusb_device *dev)
{
   long refcnt;

   if (!dev)
      return;

   refcnt = usbi_atomic_dec(&dev->refcnt);
   assert(refcnt >= 0);

   if (refcnt == 0) {
      usbi_dbg(DEVICE_CTX(dev), "destroy device %d.%d", dev->bus_number, dev->device_address);

      libusb_unref_device(dev->parent_dev);

      if (usbi_backend.destroy_device)
         usbi_backend.destroy_device(dev);

      if (!libusb_has_capability(LIBUSB_CAP_HAS_HOTPLUG)) {
         /* backend does not support hotplug */
         usbi_disconnect_device(dev);
      }

      free(dev);
   }
}

/** \ingroup libusb_dev
 * Wrap a platform-specific system device handle and obtain a libusb device
 * handle for the underlying device. The handle allows you to use libusb to
 * perform I/O on the device in question.
 *
 * Call libusb_init_context with the LIBUSB_OPTION_NO_DEVICE_DISCOVERY
 * option if you want to skip enumeration of USB devices. In particular, this
 * might be needed on Android if you don't have authority to access USB
 * devices in general. Setting this option with libusb_set_option is deprecated.
 *
 * On Linux, the system device handle must be a valid file descriptor opened
 * on the device node.
 *
 * The system device handle must remain open until libusb_close() is called.
 * The system device handle will not be closed by libusb_close().
 *
 * Internally, this function creates a temporary device and makes it
 * available to you through libusb_get_device(). This device is destroyed
 * during libusb_close(). The device shall not be opened through libusb_open().
 *
 * This is a non-blocking function; no requests are sent over the bus.
 *
 * Since version 1.0.23, \ref LIBUSB_API_VERSION >= 0x01000107
 *
 * \param ctx the context to operate on, or NULL for the default context
 * \param sys_dev the platform-specific system device handle
 * \param dev_handle output location for the returned device handle pointer. Only
 * populated when the return code is 0.
 * \returns 0 on success
 * \returns \ref LIBUSB_ERROR_NO_MEM on memory allocation failure
 * \returns \ref LIBUSB_ERROR_ACCESS if the user has insufficient permissions
 * \returns \ref LIBUSB_ERROR_NOT_SUPPORTED if the operation is not supported on this
 * platform
 * \returns another LIBUSB_ERROR code on other failure
 */
int API_EXPORTED libusb_wrap_sys_device(libusb_context *ctx, intptr_t sys_dev,
   libusb_device_handle **dev_handle)
{
   struct libusb_device_handle *_dev_handle;
   size_t priv_size = usbi_backend.device_handle_priv_size;
   int r;

   usbi_dbg(ctx, "wrap_sys_device 0x%" PRIxPTR, (uintptr_t)sys_dev);

   ctx = usbi_get_context(ctx);

   if (!usbi_backend.wrap_sys_device)
      return LIBUSB_ERROR_NOT_SUPPORTED;

   _dev_handle = calloc(1, PTR_ALIGN(sizeof(*_dev_handle)) + priv_size);
   if (!_dev_handle)
      return LIBUSB_ERROR_NO_MEM;

   usbi_mutex_init(&_dev_handle->lock);

   r = usbi_backend.wrap_sys_device(ctx, _dev_handle, sys_dev);
   if (r < 0) {
      usbi_dbg(ctx, "wrap_sys_device 0x%" PRIxPTR " returns %d", (uintptr_t)sys_dev, r);
      usbi_mutex_destroy(&_dev_handle->lock);
      free(_dev_handle);
      return r;
   }

   usbi_mutex_lock(&ctx->open_devs_lock);
   list_add(&_dev_handle->list, &ctx->open_devs);
   usbi_mutex_unlock(&ctx->open_devs_lock);
   *dev_handle = _dev_handle;

   return 0;
}

/** \ingroup libusb_dev
 * Open a device and obtain a device handle. A handle allows you to perform
 * I/O on the device in question.
 *
 * Internally, this function adds a reference to the device and makes it
 * available to you through libusb_get_device(). This reference is removed
 * during libusb_close().
 *
 * This is a non-blocking function; no requests are sent over the bus.
 *
 * \param dev the device to open
 * \param dev_handle output location for the returned device handle pointer. Only
 * populated when the return code is 0.
 * \returns 0 on success
 * \returns \ref LIBUSB_ERROR_NO_MEM on memory allocation failure
 * \returns \ref LIBUSB_ERROR_ACCESS if the user has insufficient permissions
 * \returns \ref LIBUSB_ERROR_NO_DEVICE if the device has been disconnected
 * \returns another LIBUSB_ERROR code on other failure
 */
int API_EXPORTED libusb_open(libusb_device *dev,
   libusb_device_handle **dev_handle)
{
//JC++
#if defined __ANDROID__
    return alibusb_open(dev, dev_handle);
#endif
   struct libusb_context *ctx = DEVICE_CTX(dev);
   struct libusb_device_handle *_dev_handle;
   size_t priv_size = usbi_backend.device_handle_priv_size;
   int r;

   usbi_dbg(DEVICE_CTX(dev), "open %d.%d", dev->bus_number, dev->device_address);

   if (!usbi_atomic_load(&dev->attached))
      return LIBUSB_ERROR_NO_DEVICE;

   _dev_handle = calloc(1, PTR_ALIGN(sizeof(*_dev_handle)) + priv_size);
   if (!_dev_handle)
      return LIBUSB_ERROR_NO_MEM;

   usbi_mutex_init(&_dev_handle->lock);

   _dev_handle->dev = libusb_ref_device(dev);

   r = usbi_backend.open(_dev_handle);
   if (r < 0) {
      usbi_dbg(DEVICE_CTX(dev), "open %d.%d returns %d", dev->bus_number, dev->device_address, r);
      libusb_unref_device(dev);
      usbi_mutex_destroy(&_dev_handle->lock);
      free(_dev_handle);
      return r;
   }

   usbi_mutex_lock(&ctx->open_devs_lock);
   list_add(&_dev_handle->list, &ctx->open_devs);
   usbi_mutex_unlock(&ctx->open_devs_lock);
   *dev_handle = _dev_handle;

   return 0;
}

/** \ingroup libusb_dev
 * Convenience function for finding a device with a particular
 * <tt>idVendor</tt>/<tt>idProduct</tt> combination. This function is intended
 * for those scenarios where you are using libusb to knock up a quick test
 * application - it allows you to avoid calling libusb_get_device_list() and
 * worrying about traversing/freeing the list.
 *
 * This function has limitations and is hence not intended for use in real
 * applications: if multiple devices have the same IDs it will only
 * give you the first one, etc.
 *
 * \param ctx the context to operate on, or NULL for the default context
 * \param vendor_id the idVendor value to search for
 * \param product_id the idProduct value to search for
 * \returns a device handle for the first found device, or NULL on error
 * or if the device could not be found. */
DEFAULT_VISIBILITY
libusb_device_handle * LIBUSB_CALL libusb_open_device_with_vid_pid(
   libusb_context *ctx, uint16_t vendor_id, uint16_t product_id)
{
   struct libusb_device **devs;
   struct libusb_device *found = NULL;
   struct libusb_device *dev;
   struct libusb_device_handle *dev_handle = NULL;
   size_t i = 0;
   int r;

   if (libusb_get_device_list(ctx, &devs) < 0)
      return NULL;

   while ((dev = devs[i++]) != NULL) {
      struct libusb_device_descriptor desc;
      r = libusb_get_device_descriptor(dev, &desc);
      if (r < 0)
         goto out;
      if (desc.idVendor == vendor_id && desc.idProduct == product_id) {
         found = dev;
         break;
      }
   }

   if (found) {
      r = libusb_open(found, &dev_handle);
      if (r < 0)
         dev_handle = NULL;
   }

out:
   libusb_free_device_list(devs, 1);
   return dev_handle;
}

static void do_close(struct libusb_context *ctx,
   struct libusb_device_handle *dev_handle)
{
   struct usbi_transfer *itransfer;
   struct usbi_transfer *tmp;

   /* remove any transfers in flight that are for this device */
   usbi_mutex_lock(&ctx->flying_transfers_lock);

   /* safe iteration because transfers may be being deleted */
   for_each_transfer_safe(ctx, itransfer, tmp) {
      struct libusb_transfer *transfer =
         USBI_TRANSFER_TO_LIBUSB_TRANSFER(itransfer);
      uint32_t state_flags;

      if (transfer->dev_handle != dev_handle)
         continue;

      usbi_mutex_lock(&itransfer->lock);
      state_flags = itransfer->state_flags;
      usbi_mutex_unlock(&itransfer->lock);
      if (!(state_flags & USBI_TRANSFER_DEVICE_DISAPPEARED)) {
         usbi_err(ctx, "Device handle closed while transfer was still being processed, but the device is still connected as far as we know");

         if (state_flags & USBI_TRANSFER_CANCELLING)
            usbi_warn(ctx, "A cancellation for an in-flight transfer hasn't completed but closing the device handle");
         else
            usbi_err(ctx, "A cancellation hasn't even been scheduled on the transfer for which the device is closing");
      }

      /* remove from the list of in-flight transfers and make sure
       * we don't accidentally use the device handle in the future
       * (or that such accesses will be easily caught and identified as a crash)
       */
      list_del(&itransfer->list);
      transfer->dev_handle = NULL;

      /* it is up to the user to free up the actual transfer struct.  this is
       * just making sure that we don't attempt to process the transfer after
       * the device handle is invalid
       */
      usbi_dbg(ctx, "Removed transfer %p from the in-flight list because device handle %p closed",
          (void *) transfer, (void *) dev_handle);
   }
   usbi_mutex_unlock(&ctx->flying_transfers_lock);

   usbi_mutex_lock(&ctx->open_devs_lock);
   list_del(&dev_handle->list);
   usbi_mutex_unlock(&ctx->open_devs_lock);

   usbi_backend.close(dev_handle);
   libusb_unref_device(dev_handle->dev);
   usbi_mutex_destroy(&dev_handle->lock);
   free(dev_handle);
}

/** \ingroup libusb_dev
 * Close a device handle. Should be called on all open handles before your
 * application exits.
 *
 * Internally, this function destroys the reference that was added by
 * libusb_open() on the given device.
 *
 * This is a non-blocking function; no requests are sent over the bus.
 *
 * \param dev_handle the device handle to close
 */
void API_EXPORTED libusb_close(libusb_device_handle *dev_handle)
{
//JC++
#if defined __ANDROID__
    alibusb_close(dev_handle);
    return;
#endif
   struct libusb_context *ctx;
   unsigned int event_flags;
   int handling_events;

   if (!dev_handle)
      return;
   ctx = HANDLE_CTX(dev_handle);
   usbi_dbg(ctx, " ");

   handling_events = usbi_handling_events(ctx);

   /* Similarly to libusb_open(), we want to interrupt all event handlers
    * at this point. More importantly, we want to perform the actual close of
    * the device while holding the event handling lock (preventing any other
    * thread from doing event handling) because we will be removing a file
    * descriptor from the polling loop. If this is being called by the current
    * event handler, we can bypass the interruption code because we already
    * hold the event handling lock. */

   if (!handling_events) {
      /* Record that we are closing a device.
       * Only signal an event if there are no prior pending events. */
      usbi_mutex_lock(&ctx->event_data_lock);
      event_flags = ctx->event_flags;
      if (!ctx->device_close++)
         ctx->event_flags |= USBI_EVENT_DEVICE_CLOSE;
      if (!event_flags)
         usbi_signal_event(&ctx->event);
      usbi_mutex_unlock(&ctx->event_data_lock);

      /* take event handling lock */
      libusb_lock_events(ctx);
   }

   /* Close the device */
   do_close(ctx, dev_handle);

   if (!handling_events) {
      /* We're done with closing this device.
       * Clear the event pipe if there are no further pending events. */
      usbi_mutex_lock(&ctx->event_data_lock);
      if (!--ctx->device_close)
         ctx->event_flags &= ~USBI_EVENT_DEVICE_CLOSE;
      if (!ctx->event_flags)
         usbi_clear_event(&ctx->event);
      usbi_mutex_unlock(&ctx->event_data_lock);

      /* Release event handling lock and wake up event waiters */
      libusb_unlock_events(ctx);
   }
}

/** \ingroup libusb_dev
 * Get the underlying device for a device handle. This function does not modify
 * the reference count of the returned device, so do not feel compelled to
 * unreference it when you are done.
 * \param dev_handle a device handle
 * \returns the underlying device
 */
DEFAULT_VISIBILITY
libusb_device * LIBUSB_CALL libusb_get_device(libusb_device_handle *dev_handle)
{
   return dev_handle->dev;
}

/** \ingroup libusb_dev
 * Determine the bConfigurationValue of the currently active configuration.
 *
 * You could formulate your own control request to obtain this information,
 * but this function has the advantage that it may be able to retrieve the
 * information from operating system caches (no I/O involved).
 *
 * If the OS does not cache this information, then this function will block
 * while a control transfer is submitted to retrieve the information.
 *
 * This function will return a value of 0 in the <tt>config</tt> output
 * parameter if the device is in unconfigured state.
 *
 * \param dev_handle a device handle
 * \param config output location for the bConfigurationValue of the active
 * configuration (only valid for return code 0)
 * \returns 0 on success
 * \returns \ref LIBUSB_ERROR_NO_DEVICE if the device has been disconnected
 * \returns another LIBUSB_ERROR code on other failure
 */
int API_EXPORTED libusb_get_configuration(libusb_device_handle *dev_handle,
   int *config)
{
   int r = LIBUSB_ERROR_NOT_SUPPORTED;
   uint8_t tmp = 0;
   struct libusb_context *ctx = HANDLE_CTX(dev_handle);

   usbi_dbg(ctx, " ");
   if (usbi_backend.get_configuration)
      r = usbi_backend.get_configuration(dev_handle, &tmp);

   if (r == LIBUSB_ERROR_NOT_SUPPORTED) {
      usbi_dbg(ctx, "falling back to control message");
      r = libusb_control_transfer(dev_handle, LIBUSB_ENDPOINT_IN,
         LIBUSB_REQUEST_GET_CONFIGURATION, 0, 0, &tmp, 1, 1000);
      if (r == 1) {
         r = 0;
      } else if (r == 0) {
         usbi_err(ctx, "zero bytes returned in ctrl transfer?");
         r = LIBUSB_ERROR_IO;
      } else {
         usbi_dbg(ctx, "control failed, error %d", r);
      }
   }

   if (r == 0) {
      usbi_dbg(ctx, "active config %u", tmp);
      *config = (int)tmp;
   }

   return r;
}

/** \ingroup libusb_dev
 * Set the active configuration for a device.
 *
 * The operating system may or may not have already set an active
 * configuration on the device. It is up to your application to ensure the
 * correct configuration is selected before you attempt to claim interfaces
 * and perform other operations.
 *
 * If you call this function on a device already configured with the selected
 * configuration, then this function will act as a lightweight device reset:
 * it will issue a SET_CONFIGURATION request using the current configuration,
 * causing most USB-related device state to be reset (altsetting reset to zero,
 * endpoint halts cleared, toggles reset).
 *
 * Not all backends support setting the configuration from user space, which
 * will be indicated by the return code \ref LIBUSB_ERROR_NOT_SUPPORTED. As this
 * suggests that the platform is handling the device configuration itself,
 * this error should generally be safe to ignore.
 *
 * You cannot change/reset configuration if your application has claimed
 * interfaces. It is advised to set the desired configuration before claiming
 * interfaces.
 *
 * Alternatively you can call libusb_release_interface() first. Note if you
 * do things this way you must ensure that auto_detach_kernel_driver for
 * <tt>dev</tt> is 0, otherwise the kernel driver will be re-attached when you
 * release the interface(s).
 *
 * You cannot change/reset configuration if other applications or drivers have
 * claimed interfaces.
 *
 * A configuration value of -1 will put the device in unconfigured state.
 * The USB specifications state that a configuration value of 0 does this,
 * however buggy devices exist which actually have a configuration 0.
 *
 * You should always use this function rather than formulating your own
 * SET_CONFIGURATION control request. This is because the underlying operating
 * system needs to know when such changes happen.
 *
 * This is a blocking function.
 *
 * \param dev_handle a device handle
 * \param configuration the bConfigurationValue of the configuration you
 * wish to activate, or -1 if you wish to put the device in an unconfigured
 * state
 * \returns 0 on success
 * \returns \ref LIBUSB_ERROR_NOT_FOUND if the requested configuration does not exist
 * \returns \ref LIBUSB_ERROR_BUSY if interfaces are currently claimed
 * \returns \ref LIBUSB_ERROR_NOT_SUPPORTED if setting or changing the configuration
 * is not supported by the backend
 * \returns \ref LIBUSB_ERROR_NO_DEVICE if the device has been disconnected
 * \returns another LIBUSB_ERROR code on other failure
 * \see libusb_set_auto_detach_kernel_driver()
 */
int API_EXPORTED libusb_set_configuration(libusb_device_handle *dev_handle,
   int configuration)
{
   usbi_dbg(HANDLE_CTX(dev_handle), "configuration %d", configuration);
   if (configuration < -1 || configuration > (int)UINT8_MAX)
      return LIBUSB_ERROR_INVALID_PARAM;
   return usbi_backend.set_configuration(dev_handle, configuration);
}

/** \ingroup libusb_dev
 * Claim an interface on a given device handle. You must claim the interface
 * you wish to use before you can perform I/O on any of its endpoints.
 *
 * It is legal to attempt to claim an already-claimed interface, in which
 * case libusb just returns 0 without doing anything.
 *
 * If auto_detach_kernel_driver is set to 1 for <tt>dev</tt>, the kernel driver
 * will be detached if necessary, on failure the detach error is returned.
 *
 * Claiming of interfaces is a purely logical operation; it does not cause
 * any requests to be sent over the bus. Interface claiming is used to
 * instruct the underlying operating system that your application wishes
 * to take ownership of the interface.
 *
 * This is a non-blocking function.
 *
 * \param dev_handle a device handle
 * \param interface_number the <tt>bInterfaceNumber</tt> of the interface you
 * wish to claim
 * \returns 0 on success
 * \returns \ref LIBUSB_ERROR_NOT_FOUND if the requested interface does not exist
 * \returns \ref LIBUSB_ERROR_BUSY if another program or driver has claimed the
 * interface
 * \returns \ref LIBUSB_ERROR_NO_DEVICE if the device has been disconnected
 * \returns a LIBUSB_ERROR code on other failure
 * \see libusb_set_auto_detach_kernel_driver()
 */
int API_EXPORTED libusb_claim_interface(libusb_device_handle *dev_handle,
   int interface_number)
{
   int r = 0;

   usbi_dbg(HANDLE_CTX(dev_handle), "interface %d", interface_number);
   if (interface_number < 0 || interface_number >= USB_MAXINTERFACES)
      return LIBUSB_ERROR_INVALID_PARAM;

   if (!usbi_atomic_load(&dev_handle->dev->attached))
      return LIBUSB_ERROR_NO_DEVICE;

   usbi_mutex_lock(&dev_handle->lock);
   if (dev_handle->claimed_interfaces & (1U << interface_number))
      goto out;

   r = usbi_backend.claim_interface(dev_handle, (uint8_t)interface_number);
   if (r == 0)
      dev_handle->claimed_interfaces |= 1U << interface_number;

out:
   usbi_mutex_unlock(&dev_handle->lock);
   return r;
}

/** \ingroup libusb_dev
 * Release an interface previously claimed with libusb_claim_interface(). You
 * should release all claimed interfaces before closing a device handle.
 *
 * This is a blocking function. A SET_INTERFACE control request will be sent
 * to the device, resetting interface state to the first alternate setting.
 *
 * If auto_detach_kernel_driver is set to 1 for <tt>dev</tt>, the kernel
 * driver will be re-attached after releasing the interface.
 *
 * \param dev_handle a device handle
 * \param interface_number the <tt>bInterfaceNumber</tt> of the
 * previously-claimed interface
 * \returns 0 on success
 * \returns \ref LIBUSB_ERROR_NOT_FOUND if the interface was not claimed
 * \returns \ref LIBUSB_ERROR_NO_DEVICE if the device has been disconnected
 * \returns another LIBUSB_ERROR code on other failure
 * \see libusb_set_auto_detach_kernel_driver()
 */
int API_EXPORTED libusb_release_interface(libusb_device_handle *dev_handle,
   int interface_number)
{
   int r;

   usbi_dbg(HANDLE_CTX(dev_handle), "interface %d", interface_number);
   if (interface_number < 0 || interface_number >= USB_MAXINTERFACES)
      return LIBUSB_ERROR_INVALID_PARAM;

   usbi_mutex_lock(&dev_handle->lock);
   if (!(dev_handle->claimed_interfaces & (1U << interface_number))) {
      r = LIBUSB_ERROR_NOT_FOUND;
      goto out;
   }

   r = usbi_backend.release_interface(dev_handle, (uint8_t)interface_number);
   if (r == 0)
      dev_handle->claimed_interfaces &= ~(1U << interface_number);

out:
   usbi_mutex_unlock(&dev_handle->lock);
   return r;
}

/** \ingroup libusb_dev
 * Activate an alternate setting for an interface. The interface must have
 * been previously claimed with libusb_claim_interface().
 *
 * You should always use this function rather than formulating your own
 * SET_INTERFACE control request. This is because the underlying operating
 * system needs to know when such changes happen.
 *
 * This is a blocking function.
 *
 * \param dev_handle a device handle
 * \param interface_number the <tt>bInterfaceNumber</tt> of the
 * previously-claimed interface
 * \param alternate_setting the <tt>bAlternateSetting</tt> of the alternate
 * setting to activate
 * \returns 0 on success
 * \returns \ref LIBUSB_ERROR_NOT_FOUND if the interface was not claimed, or the
 * requested alternate setting does not exist
 * \returns \ref LIBUSB_ERROR_NO_DEVICE if the device has been disconnected
 * \returns another LIBUSB_ERROR code on other failure
 */
int API_EXPORTED libusb_set_interface_alt_setting(libusb_device_handle *dev_handle,
   int interface_number, int alternate_setting)
{
   usbi_dbg(HANDLE_CTX(dev_handle), "interface %d altsetting %d",
      interface_number, alternate_setting);
   if (interface_number < 0 || interface_number >= USB_MAXINTERFACES)
      return LIBUSB_ERROR_INVALID_PARAM;
   if (alternate_setting < 0 || alternate_setting > (int)UINT8_MAX)
      return LIBUSB_ERROR_INVALID_PARAM;

   if (!usbi_atomic_load(&dev_handle->dev->attached)) {
      return LIBUSB_ERROR_NO_DEVICE;
   }

   usbi_mutex_lock(&dev_handle->lock);
   if (!(dev_handle->claimed_interfaces & (1U << interface_number))) {
      usbi_mutex_unlock(&dev_handle->lock);
      return LIBUSB_ERROR_NOT_FOUND;
   }
   usbi_mutex_unlock(&dev_handle->lock);

   return usbi_backend.set_interface_altsetting(dev_handle,
      (uint8_t)interface_number, (uint8_t)alternate_setting);
}

/** \ingroup libusb_dev
 * Clear the halt/stall condition for an endpoint. Endpoints with halt status
 * are unable to receive or transmit data until the halt condition is stalled.
 *
 * You should cancel all pending transfers before attempting to clear the halt
 * condition.
 *
 * This is a blocking function.
 *
 * \param dev_handle a device handle
 * \param endpoint the endpoint to clear halt status
 * \returns 0 on success
 * \returns \ref LIBUSB_ERROR_NOT_FOUND if the endpoint does not exist
 * \returns \ref LIBUSB_ERROR_NO_DEVICE if the device has been disconnected
 * \returns another LIBUSB_ERROR code on other failure
 */
int API_EXPORTED libusb_clear_halt(libusb_device_handle *dev_handle,
   unsigned char endpoint)
{
   usbi_dbg(HANDLE_CTX(dev_handle), "endpoint 0x%x", endpoint);
   if (!usbi_atomic_load(&dev_handle->dev->attached))
      return LIBUSB_ERROR_NO_DEVICE;

   return usbi_backend.clear_halt(dev_handle, endpoint);
}

/** \ingroup libusb_dev
 * Perform a USB port reset to reinitialize a device. The system will attempt
 * to restore the previous configuration and alternate settings after the
 * reset has completed.
 *
 * If the reset fails, the descriptors change, or the previous state cannot be
 * restored, the device will appear to be disconnected and reconnected. This
 * means that the device handle is no longer valid (you should close it) and
 * rediscover the device. A return code of \ref LIBUSB_ERROR_NOT_FOUND indicates
 * when this is the case.
 *
 * This is a blocking function which usually incurs a noticeable delay.
 *
 * \param dev_handle a handle of the device to reset
 * \returns 0 on success
 * \returns \ref LIBUSB_ERROR_NOT_FOUND if re-enumeration is required, or if the
 * device has been disconnected
 * \returns another LIBUSB_ERROR code on other failure
 */
int API_EXPORTED libusb_reset_device(libusb_device_handle *dev_handle)
{
   usbi_dbg(HANDLE_CTX(dev_handle), " ");
   if (!usbi_atomic_load(&dev_handle->dev->attached))
      return LIBUSB_ERROR_NO_DEVICE;

   if (usbi_backend.reset_device)
      return usbi_backend.reset_device(dev_handle);
   else
      return LIBUSB_ERROR_NOT_SUPPORTED;
}

/** \ingroup libusb_asyncio
 * Allocate up to num_streams usb bulk streams on the specified endpoints. This
 * function takes an array of endpoints rather then a single endpoint because
 * some protocols require that endpoints are setup with similar stream ids.
 * All endpoints passed in must belong to the same interface.
 *
 * Note this function may return less streams then requested. Also note that the
 * same number of streams are allocated for each endpoint in the endpoint array.
 *
 * Stream id 0 is reserved, and should not be used to communicate with devices.
 * If libusb_alloc_streams() returns with a value of N, you may use stream ids
 * 1 to N.
 *
 * Since version 1.0.19, \ref LIBUSB_API_VERSION >= 0x01000103
 *
 * \param dev_handle a device handle
 * \param num_streams number of streams to try to allocate
 * \param endpoints array of endpoints to allocate streams on
 * \param num_endpoints length of the endpoints array
 * \returns number of streams allocated, or a LIBUSB_ERROR code on failure
 */
int API_EXPORTED libusb_alloc_streams(libusb_device_handle *dev_handle,
   uint32_t num_streams, unsigned char *endpoints, int num_endpoints)
{
   usbi_dbg(HANDLE_CTX(dev_handle), "streams %u eps %d", (unsigned)num_streams, num_endpoints);

   if (!num_streams || !endpoints || num_endpoints <= 0)
      return LIBUSB_ERROR_INVALID_PARAM;

   if (!usbi_atomic_load(&dev_handle->dev->attached))
      return LIBUSB_ERROR_NO_DEVICE;

   if (usbi_backend.alloc_streams)
      return usbi_backend.alloc_streams(dev_handle, num_streams, endpoints,
                     num_endpoints);
   else
      return LIBUSB_ERROR_NOT_SUPPORTED;
}

/** \ingroup libusb_asyncio
 * Free usb bulk streams allocated with libusb_alloc_streams().
 *
 * Note streams are automatically free-ed when releasing an interface.
 *
 * Since version 1.0.19, \ref LIBUSB_API_VERSION >= 0x01000103
 *
 * \param dev_handle a device handle
 * \param endpoints array of endpoints to free streams on
 * \param num_endpoints length of the endpoints array
 * \returns \ref LIBUSB_SUCCESS, or a LIBUSB_ERROR code on failure
 */
int API_EXPORTED libusb_free_streams(libusb_device_handle *dev_handle,
   unsigned char *endpoints, int num_endpoints)
{
   usbi_dbg(HANDLE_CTX(dev_handle), "eps %d", num_endpoints);

   if (!endpoints || num_endpoints <= 0)
      return LIBUSB_ERROR_INVALID_PARAM;

   if (!usbi_atomic_load(&dev_handle->dev->attached))
      return LIBUSB_ERROR_NO_DEVICE;

   if (usbi_backend.free_streams)
      return usbi_backend.free_streams(dev_handle, endpoints,
                    num_endpoints);
   else
      return LIBUSB_ERROR_NOT_SUPPORTED;
}

/** \ingroup libusb_asyncio
 * Attempts to allocate a block of persistent DMA memory suitable for transfers
 * against the given device. If successful, will return a block of memory
 * that is suitable for use as "buffer" in \ref libusb_transfer against this
 * device. Using this memory instead of regular memory means that the host
 * controller can use DMA directly into the buffer to increase performance, and
 * also that transfers can no longer fail due to kernel memory fragmentation.
 *
 * Note that this means you should not modify this memory (or even data on
 * the same cache lines) when a transfer is in progress, although it is legal
 * to have several transfers going on within the same memory block.
 *
 * Will return NULL on failure. Many systems do not support such zero-copy
 * and will always return NULL. Memory allocated with this function must be
 * freed with \ref libusb_dev_mem_free. Specifically, this means that the
 * flag \ref LIBUSB_TRANSFER_FREE_BUFFER cannot be used to free memory allocated
 * with this function.
 *
 * Since version 1.0.21, \ref LIBUSB_API_VERSION >= 0x01000105
 *
 * \param dev_handle a device handle
 * \param length size of desired data buffer
 * \returns a pointer to the newly allocated memory, or NULL on failure
 */
DEFAULT_VISIBILITY
unsigned char * LIBUSB_CALL libusb_dev_mem_alloc(libusb_device_handle *dev_handle,
        size_t length)
{
   if (!usbi_atomic_load(&dev_handle->dev->attached))
      return NULL;

   if (usbi_backend.dev_mem_alloc)
      return usbi_backend.dev_mem_alloc(dev_handle, length);
   else
      return NULL;
}

/** \ingroup libusb_asyncio
 * Free device memory allocated with libusb_dev_mem_alloc().
 *
 * \param dev_handle a device handle
 * \param buffer pointer to the previously allocated memory
 * \param length size of previously allocated memory
 * \returns \ref LIBUSB_SUCCESS, or a LIBUSB_ERROR code on failure
 */
int API_EXPORTED libusb_dev_mem_free(libusb_device_handle *dev_handle,
   unsigned char *buffer, size_t length)
{
   if (usbi_backend.dev_mem_free)
      return usbi_backend.dev_mem_free(dev_handle, buffer, length);
   else
      return LIBUSB_ERROR_NOT_SUPPORTED;
}

/** \ingroup libusb_dev
 * Determine if a kernel driver is active on an interface. If a kernel driver
 * is active, you cannot claim the interface, and libusb will be unable to
 * perform I/O.
 *
 * This functionality is not available on Windows.
 *
 * \param dev_handle a device handle
 * \param interface_number the interface to check
 * \returns 0 if no kernel driver is active
 * \returns 1 if a kernel driver is active
 * \returns \ref LIBUSB_ERROR_NO_DEVICE if the device has been disconnected
 * \returns \ref LIBUSB_ERROR_NOT_SUPPORTED on platforms where the functionality
 * is not available
 * \returns another LIBUSB_ERROR code on other failure
 * \see libusb_detach_kernel_driver()
 */
int API_EXPORTED libusb_kernel_driver_active(libusb_device_handle *dev_handle,
   int interface_number)
{
   usbi_dbg(HANDLE_CTX(dev_handle), "interface %d", interface_number);

   if (interface_number < 0 || interface_number >= USB_MAXINTERFACES)
      return LIBUSB_ERROR_INVALID_PARAM;

   if (!usbi_atomic_load(&dev_handle->dev->attached))
      return LIBUSB_ERROR_NO_DEVICE;

   if (usbi_backend.kernel_driver_active)
      return usbi_backend.kernel_driver_active(dev_handle, (uint8_t)interface_number);
   else
      return LIBUSB_ERROR_NOT_SUPPORTED;
}

/** \ingroup libusb_dev
 * Detach a kernel driver from an interface. If successful, you will then be
 * able to claim the interface and perform I/O.
 *
 * This functionality is not available on Windows.
 *
 * Note that libusb itself also talks to the device through a special kernel
 * driver, if this driver is already attached to the device, this call will
 * not detach it and return \ref LIBUSB_ERROR_NOT_FOUND.
 *
 * \param dev_handle a device handle
 * \param interface_number the interface to detach the driver from
 * \returns 0 on success
 * \returns \ref LIBUSB_ERROR_NOT_FOUND if no kernel driver was active
 * \returns \ref LIBUSB_ERROR_INVALID_PARAM if the interface does not exist
 * \returns \ref LIBUSB_ERROR_NO_DEVICE if the device has been disconnected
 * \returns \ref LIBUSB_ERROR_NOT_SUPPORTED on platforms where the functionality
 * is not available
 * \returns another LIBUSB_ERROR code on other failure
 * \see libusb_kernel_driver_active()
 */
int API_EXPORTED libusb_detach_kernel_driver(libusb_device_handle *dev_handle,
   int interface_number)
{
   usbi_dbg(HANDLE_CTX(dev_handle), "interface %d", interface_number);

   if (interface_number < 0 || interface_number >= USB_MAXINTERFACES)
      return LIBUSB_ERROR_INVALID_PARAM;

   if (!usbi_atomic_load(&dev_handle->dev->attached))
      return LIBUSB_ERROR_NO_DEVICE;

   if (usbi_backend.detach_kernel_driver)
      return usbi_backend.detach_kernel_driver(dev_handle, (uint8_t)interface_number);
   else
      return LIBUSB_ERROR_NOT_SUPPORTED;
}

/** \ingroup libusb_dev
 * Re-attach an interface's kernel driver, which was previously detached
 * using libusb_detach_kernel_driver().
 *
 * This functionality is not available on Windows.
 *
 * \param dev_handle a device handle
 * \param interface_number the interface to attach the driver from
 * \returns 0 on success
 * \returns \ref LIBUSB_ERROR_NOT_FOUND if no kernel driver was active
 * \returns \ref LIBUSB_ERROR_INVALID_PARAM if the interface does not exist
 * \returns \ref LIBUSB_ERROR_NO_DEVICE if the device has been disconnected
 * \returns \ref LIBUSB_ERROR_NOT_SUPPORTED on platforms where the functionality
 * is not available
 * \returns \ref LIBUSB_ERROR_BUSY if the driver cannot be attached because the
 * interface is claimed by a program or driver
 * \returns another LIBUSB_ERROR code on other failure
 * \see libusb_kernel_driver_active()
 */
int API_EXPORTED libusb_attach_kernel_driver(libusb_device_handle *dev_handle,
   int interface_number)
{
   usbi_dbg(HANDLE_CTX(dev_handle), "interface %d", interface_number);

   if (interface_number < 0 || interface_number >= USB_MAXINTERFACES)
      return LIBUSB_ERROR_INVALID_PARAM;

   if (!usbi_atomic_load(&dev_handle->dev->attached))
      return LIBUSB_ERROR_NO_DEVICE;

   if (usbi_backend.attach_kernel_driver)
      return usbi_backend.attach_kernel_driver(dev_handle, (uint8_t)interface_number);
   else
      return LIBUSB_ERROR_NOT_SUPPORTED;
}

/** \ingroup libusb_dev
 * Enable/disable libusb's automatic kernel driver detachment. When this is
 * enabled libusb will automatically detach the kernel driver on an interface
 * when claiming the interface, and attach it when releasing the interface.
 *
 * Automatic kernel driver detachment is disabled on newly opened device
 * handles by default.
 *
 * On platforms which do not have LIBUSB_CAP_SUPPORTS_DETACH_KERNEL_DRIVER
 * this function will return \ref LIBUSB_ERROR_NOT_SUPPORTED, and libusb will
 * continue as if this function was never called.
 *
 * \param dev_handle a device handle
 * \param enable whether to enable or disable auto kernel driver detachment
 *
 * \returns \ref LIBUSB_SUCCESS on success
 * \returns \ref LIBUSB_ERROR_NOT_SUPPORTED on platforms where the functionality
 * is not available
 * \see libusb_claim_interface()
 * \see libusb_release_interface()
 * \see libusb_set_configuration()
 */
int API_EXPORTED libusb_set_auto_detach_kernel_driver(
   libusb_device_handle *dev_handle, int enable)
{
   if (!(usbi_backend.caps & USBI_CAP_SUPPORTS_DETACH_KERNEL_DRIVER))
      return LIBUSB_ERROR_NOT_SUPPORTED;

   dev_handle->auto_detach_kernel_driver = enable;
   return LIBUSB_SUCCESS;
}

/** \ingroup libusb_lib
 * Deprecated. Use libusb_set_option() or libusb_init_context() instead,
 * with the \ref LIBUSB_OPTION_LOG_LEVEL option.
 */
void API_EXPORTED libusb_set_debug(libusb_context *ctx, int level)
{
   libusb_set_option(ctx, LIBUSB_OPTION_LOG_LEVEL, level);
}

static void libusb_set_log_cb_internal(libusb_context *ctx, libusb_log_cb cb,
                   int mode)
{
#if defined(ENABLE_LOGGING) && (!defined(ENABLE_DEBUG_LOGGING) || !defined(USE_SYSTEM_LOGGING_FACILITY))
#if !defined(USE_SYSTEM_LOGGING_FACILITY)
   if (mode & LIBUSB_LOG_CB_GLOBAL)
      log_handler = cb;
#endif
#if !defined(ENABLE_DEBUG_LOGGING)
   if (mode & LIBUSB_LOG_CB_CONTEXT) {
      ctx = usbi_get_context(ctx);
      ctx->log_handler = cb;
   }
#else
   UNUSED(ctx);
#endif
#else
   UNUSED(ctx);
   UNUSED(cb);
   UNUSED(mode);
#endif
}

/** \ingroup libusb_lib
 * Set log handler.
 *
 * libusb will redirect its log messages to the provided callback function.
 * libusb supports redirection of per context and global log messages.
 * Log messages sent to the context will be sent to the global log handler too.
 *
 * If libusb is compiled without message logging or USE_SYSTEM_LOGGING_FACILITY
 * is defined then global callback function will never be called.
 * If ENABLE_DEBUG_LOGGING is defined then per context callback function will
 * never be called.
 *
 * Since version 1.0.23, \ref LIBUSB_API_VERSION >= 0x01000107
 *
 * \param ctx context on which to assign log handler, or NULL for the default
 * context. Parameter ignored if only LIBUSB_LOG_CB_GLOBAL mode is requested.
 * \param cb pointer to the callback function, or NULL to stop log
 * messages redirection
 * \param mode mode of callback function operation. Several modes can be
 * selected for a single callback function, see \ref libusb_log_cb_mode for
 * a description.
 * \see libusb_log_cb, libusb_log_cb_mode
 */
void API_EXPORTED libusb_set_log_cb(libusb_context *ctx, libusb_log_cb cb,
   int mode)
{
   libusb_set_log_cb_internal(ctx, cb, mode);
}

/** \ingroup libusb_lib
 * Set an option in the library.
 *
 * Use this function to configure a specific option within the library.
 *
 * Some options require one or more arguments to be provided. Consult each
 * option's documentation for specific requirements.
 *
 * If the context ctx is NULL, the option will be added to a list of default
 * options that will be applied to all subsequently created contexts.
 *
 * Since version 1.0.22, \ref LIBUSB_API_VERSION >= 0x01000106
 *
 * \param ctx context on which to operate
 * \param option which option to set
 * \param ... any required arguments for the specified option
 *
 * \returns \ref LIBUSB_SUCCESS on success
 * \returns \ref LIBUSB_ERROR_INVALID_PARAM if the option or arguments are invalid
 * \returns \ref LIBUSB_ERROR_NOT_SUPPORTED if the option is valid but not supported
 * on this platform
 * \returns \ref LIBUSB_ERROR_NOT_FOUND if LIBUSB_OPTION_USE_USBDK is valid on this platform but UsbDk is not available
 */
int API_EXPORTEDV libusb_set_option(libusb_context *ctx,
   enum libusb_option option, ...)
{
   int arg = 0, r = LIBUSB_SUCCESS;
   libusb_log_cb log_cb = NULL;
   va_list ap;
#if defined(ENABLE_LOGGING) && !defined(ENABLE_DEBUG_LOGGING)
   int is_default_context = (NULL == ctx);
#endif

   va_start(ap, option);

   if (LIBUSB_OPTION_LOG_LEVEL == option) {
      arg = va_arg(ap, int);
      if (arg < LIBUSB_LOG_LEVEL_NONE || arg > LIBUSB_LOG_LEVEL_DEBUG) {
         r = LIBUSB_ERROR_INVALID_PARAM;
      }
   }
   if (LIBUSB_OPTION_LOG_CB == option) {
      log_cb = (libusb_log_cb) va_arg(ap, libusb_log_cb);
   }

   do {
      if (LIBUSB_SUCCESS != r) {
         break;
      }

      if (option >= LIBUSB_OPTION_MAX) {
         r = LIBUSB_ERROR_INVALID_PARAM;
         break;
      }

      if (NULL == ctx) {
         usbi_mutex_static_lock(&default_context_lock);
         default_context_options[option].is_set = 1;
         if (LIBUSB_OPTION_LOG_LEVEL == option) {
            default_context_options[option].arg.ival = arg;
         } else if (LIBUSB_OPTION_LOG_CB == option) {
            default_context_options[option].arg.log_cbval = log_cb;
            libusb_set_log_cb_internal(NULL, log_cb, LIBUSB_LOG_CB_GLOBAL);
         }
         usbi_mutex_static_unlock(&default_context_lock);
      }

      ctx = usbi_get_context(ctx);
      if (NULL == ctx)
         break;

      switch (option) {
      case LIBUSB_OPTION_LOG_LEVEL:
#if defined(ENABLE_LOGGING) && !defined(ENABLE_DEBUG_LOGGING)
         if (!ctx->debug_fixed) {
            ctx->debug = (enum libusb_log_level)arg;
            if (is_default_context)
               usbi_atomic_store(&default_debug_level, CLAMP(arg, LIBUSB_LOG_LEVEL_NONE, LIBUSB_LOG_LEVEL_DEBUG));
         }
#endif
         break;

         /* Handle all backend-specific options here */
      case LIBUSB_OPTION_USE_USBDK:
      case LIBUSB_OPTION_NO_DEVICE_DISCOVERY:
         if (usbi_backend.set_option) {
            r = usbi_backend.set_option(ctx, option, ap);
            break;
         }

         r = LIBUSB_ERROR_NOT_SUPPORTED;
         break;

      case LIBUSB_OPTION_LOG_CB:
         libusb_set_log_cb_internal(ctx, log_cb, LIBUSB_LOG_CB_CONTEXT);
         break;

      case LIBUSB_OPTION_MAX: /* unreachable */
      default:
         r = LIBUSB_ERROR_INVALID_PARAM;
      }
   } while (0);

   va_end(ap);

   return r;
}

#if defined(ENABLE_LOGGING) && !defined(ENABLE_DEBUG_LOGGING)
/* returns the log level as defined in the LIBUSB_DEBUG environment variable.
 * if LIBUSB_DEBUG is not present or not a number, returns LIBUSB_LOG_LEVEL_NONE.
 * value is clamped to ensure it is within the valid range of possibilities.
 */
static enum libusb_log_level get_env_debug_level(void)
{
   const char *dbg = getenv("LIBUSB_DEBUG");
   enum libusb_log_level level;
   if (dbg) {
      int dbg_level = atoi(dbg);
      dbg_level = CLAMP(dbg_level, LIBUSB_LOG_LEVEL_NONE, LIBUSB_LOG_LEVEL_DEBUG);
      level = (enum libusb_log_level)dbg_level;
   } else {
      level = LIBUSB_LOG_LEVEL_NONE;
   }
   return level;
}
#endif

/** \ingroup libusb_lib
 * Deprecated initialization function. Equivalent to calling libusb_init_context with no options.
 *
 * \see libusb_init_context
 */
int API_EXPORTED libusb_init(libusb_context **ctx)
{
   return libusb_init_context(ctx, NULL, 0);
}

/** \ingroup libusb_lib
 * Initialize libusb. This function must be called before calling any other
 * libusb function.
 *
 * If you do not provide an output location for a context pointer, a default
 * context will be created. If there was already a default context, it will
 * be reused (and nothing will be initialized/reinitialized and options will
 * be ignored). If num_options is 0 then options is ignored and may be NULL.
 *
 * Since version 1.0.27, \ref LIBUSB_API_VERSION >= 0x0100010A
 *
 * \param ctx Optional output location for context pointer.
 * Only valid on return code 0.
 * \param options Optional array of options to set on the new context.
 * \param num_options Number of elements in the options array.
 * \returns 0 on success, or a LIBUSB_ERROR code on failure
 * \see libusb_contexts
 */
int API_EXPORTED libusb_init_context(libusb_context **ctx, const struct libusb_init_option options[], int num_options)
{
//JC++
#if defined __ANDROID__
    int ra = alibusb_init();
   if (ra < 0)
      return ra;
#endif
   size_t priv_size = usbi_backend.context_priv_size;
   struct libusb_context *_ctx;
   int r;

   usbi_mutex_static_lock(&default_context_lock);

   if (!ctx && default_context_refcnt > 0) {
      usbi_dbg(usbi_default_context, "reusing default context");
      default_context_refcnt++;
      usbi_mutex_static_unlock(&default_context_lock);
      return 0;
   }

   /* check for first init */
   usbi_mutex_static_lock(&active_contexts_lock);
   if (!active_contexts_list.next) {
      list_init(&active_contexts_list);
      usbi_get_monotonic_time(&timestamp_origin);
   }
   usbi_mutex_static_unlock(&active_contexts_lock);

   _ctx = calloc(1, PTR_ALIGN(sizeof(*_ctx)) + priv_size);
   if (!_ctx) {
      usbi_mutex_static_unlock(&default_context_lock);
      return LIBUSB_ERROR_NO_MEM;
   }

#if defined(ENABLE_LOGGING) && !defined(ENABLE_DEBUG_LOGGING)
   _ctx->debug = LIBUSB_LOG_LEVEL_NONE;
   if (getenv("LIBUSB_DEBUG")) {
      _ctx->debug = get_env_debug_level();
      _ctx->debug_fixed = 1;
   } else if (default_context_options[LIBUSB_OPTION_LOG_LEVEL].is_set) {
      _ctx->debug = default_context_options[LIBUSB_OPTION_LOG_LEVEL].arg.ival;
   }
#endif

   usbi_mutex_init(&_ctx->usb_devs_lock);
   usbi_mutex_init(&_ctx->open_devs_lock);
   list_init(&_ctx->usb_devs);
   list_init(&_ctx->open_devs);

   /* apply default options to all new contexts */
   for (enum libusb_option option = 0 ; option < LIBUSB_OPTION_MAX ; option++) {
      if (LIBUSB_OPTION_LOG_LEVEL == option || !default_context_options[option].is_set) {
         continue;
      }
      if (LIBUSB_OPTION_LOG_CB != option) {
         r = libusb_set_option(_ctx, option);
      } else {
         r = libusb_set_option(_ctx, option, default_context_options[option].arg.log_cbval);
      }
      if (LIBUSB_SUCCESS != r)
         goto err_free_ctx;
   }

   /* apply any options provided by the user */
   for (int i = 0 ; i < num_options ; ++i) {
      switch(options[i].option) {
      case LIBUSB_OPTION_LOG_CB:
         r = libusb_set_option(_ctx, options[i].option, options[i].value.log_cbval);
         break;

      case LIBUSB_OPTION_LOG_LEVEL:
      case LIBUSB_OPTION_USE_USBDK:
      case LIBUSB_OPTION_NO_DEVICE_DISCOVERY:
      case LIBUSB_OPTION_MAX:
      default:
         r = libusb_set_option(_ctx, options[i].option, options[i].value.ival);
      }
      if (LIBUSB_SUCCESS != r)
         goto err_free_ctx;
   }

   /* default context must be initialized before calling usbi_dbg */
   if (!ctx) {
      usbi_default_context = _ctx;
      default_context_refcnt = 1;
#if defined(ENABLE_LOGGING) && !defined(ENABLE_DEBUG_LOGGING)
      usbi_atomic_store(&default_debug_level, _ctx->debug);
#endif
      usbi_dbg(usbi_default_context, "created default context");
   }

   usbi_dbg(_ctx, "libusb v%u.%u.%u.%u%s", libusb_version_internal.major, libusb_version_internal.minor,
      libusb_version_internal.micro, libusb_version_internal.nano, libusb_version_internal.rc);

   r = usbi_io_init(_ctx);
   if (r < 0)
      goto err_free_ctx;

   usbi_mutex_static_lock(&active_contexts_lock);
   list_add(&_ctx->list, &active_contexts_list);
   usbi_mutex_static_unlock(&active_contexts_lock);

   if (usbi_backend.init) {
      r = usbi_backend.init(_ctx);
      if (r)
         goto err_io_exit;
   }

   /* Initialize hotplug after the initial enumeration is done. */
   usbi_hotplug_init(_ctx);

   if (ctx) {
      *ctx = _ctx;

      if (!usbi_fallback_context) {
#if defined(ENABLE_LOGGING) && !defined(ENABLE_DEBUG_LOGGING)
         if (usbi_atomic_load(&default_debug_level) == -1)
            usbi_atomic_store(&default_debug_level, _ctx->debug);
#endif
         usbi_fallback_context = _ctx;
         usbi_dbg(usbi_fallback_context, "installing new context as implicit default");
      }
   }

   usbi_mutex_static_unlock(&default_context_lock);

   return 0;

err_io_exit:
   usbi_mutex_static_lock(&active_contexts_lock);
   list_del(&_ctx->list);
   usbi_mutex_static_unlock(&active_contexts_lock);

   usbi_hotplug_exit(_ctx);
   usbi_io_exit(_ctx);

err_free_ctx:
   if (!ctx) {
      /* clear default context that was not fully initialized */
      usbi_default_context = NULL;
      default_context_refcnt = 0;
   }

   usbi_mutex_destroy(&_ctx->open_devs_lock);
   usbi_mutex_destroy(&_ctx->usb_devs_lock);

   free(_ctx);

   usbi_mutex_static_unlock(&default_context_lock);

   return r;
}

/** \ingroup libusb_lib
 * Deinitialize libusb. Should be called after closing all open devices and
 * before your application terminates.
 * \param ctx the context to deinitialize, or NULL for the default context
 */
void API_EXPORTED libusb_exit(libusb_context *ctx)
{
   struct libusb_context *_ctx;
   struct libusb_device *dev;

   usbi_mutex_static_lock(&default_context_lock);

   /* if working with default context, only actually do the deinitialization
    * if we're the last user */
   if (!ctx) {
      if (!usbi_default_context) {
         usbi_dbg(ctx, "no default context, not initialized?");
         usbi_mutex_static_unlock(&default_context_lock);
         return;
      }

      if (--default_context_refcnt > 0) {
         usbi_dbg(ctx, "not destroying default context");
         usbi_mutex_static_unlock(&default_context_lock);
         return;
      }

      usbi_dbg(ctx, "destroying default context");
      _ctx = usbi_default_context;
   } else {
      usbi_dbg(ctx, " ");
      _ctx = ctx;
   }

   usbi_mutex_static_lock(&active_contexts_lock);
   list_del(&_ctx->list);
   usbi_mutex_static_unlock(&active_contexts_lock);

   /* Exit hotplug before backend dependency */
   usbi_hotplug_exit(_ctx);

   if (usbi_backend.exit)
      usbi_backend.exit(_ctx);

   if (!ctx)
      usbi_default_context = NULL;
   if (ctx == usbi_fallback_context)
      usbi_fallback_context = NULL;

   usbi_mutex_static_unlock(&default_context_lock);

   /* Don't bother with locking after this point because unless there is
    * an application bug, nobody will be accessing the context. */

   usbi_io_exit(_ctx);

   for_each_device(_ctx, dev) {
      usbi_warn(_ctx, "device %d.%d still referenced",
         dev->bus_number, dev->device_address);
      DEVICE_CTX(dev) = NULL;
   }

   if (!list_empty(&_ctx->open_devs))
      usbi_warn(_ctx, "application left some devices open");

   usbi_mutex_destroy(&_ctx->open_devs_lock);
   usbi_mutex_destroy(&_ctx->usb_devs_lock);

   free(_ctx);
}

/** \ingroup libusb_misc
 * Check at runtime if the loaded library has a given capability.
 * This call should be performed after \ref libusb_init_context(), to ensure the
 * backend has updated its capability set.
 *
 * \param capability the \ref libusb_capability to check for
 * \returns nonzero if the running library has the capability, 0 otherwise
 */
int API_EXPORTED libusb_has_capability(uint32_t capability)
{
   switch (capability) {
   case LIBUSB_CAP_HAS_CAPABILITY:
      return 1;
   case LIBUSB_CAP_HAS_HOTPLUG:
      return !(usbi_backend.get_device_list);
   case LIBUSB_CAP_HAS_HID_ACCESS:
      return (usbi_backend.caps & USBI_CAP_HAS_HID_ACCESS);
   case LIBUSB_CAP_SUPPORTS_DETACH_KERNEL_DRIVER:
      return (usbi_backend.caps & USBI_CAP_SUPPORTS_DETACH_KERNEL_DRIVER);
   }
   return 0;
}

#if defined ENABLE_LOGGING

/* this is defined in libusbi.h if needed */
#if defined LIBUSB_PRINTF_WIN32
/*
 * Prior to VS2015, Microsoft did not provide the snprintf() function and
 * provided a vsnprintf() that did not guarantee NUL-terminated output.
 * Microsoft did provide a _snprintf() function, but again it did not
 * guarantee NULL-terminated output.
 *
 * The below implementations guarantee NUL-terminated output and are
 * C99 compliant.
 */

int usbi_snprintf(char *str, size_t size, const char *format, ...)
{
   va_list args;
   int ret;

   va_start(args, format);
   ret = usbi_vsnprintf(str, size, format, args);
   va_end(args);

   return ret;
}

int usbi_vsnprintf(char *str, size_t size, const char *format, va_list args)
{
   int ret;

   ret = _vsnprintf(str, size, format, args);
   if (ret < 0 || ret == (int)size) {
      /* Output is truncated, ensure buffer is NUL-terminated and
       * determine how many characters would have been written. */
      str[size - 1] = '\0';
      if (ret < 0)
         ret = _vsnprintf(NULL, 0, format, args);
   }

   return ret;
}
#endif /* LIBUSB_PRINTF_WIN32 */

static void log_str(enum libusb_log_level level, const char *str)
{
#if defined(USE_SYSTEM_LOGGING_FACILITY)
#if defined(__ANDROID__)
   int priority;
   switch (level) {
   case LIBUSB_LOG_LEVEL_NONE: return;	/* Impossible, but keeps compiler happy */
   case LIBUSB_LOG_LEVEL_ERROR: priority = ANDROID_LOG_ERROR; break;
   case LIBUSB_LOG_LEVEL_WARNING: priority = ANDROID_LOG_WARN; break;
   case LIBUSB_LOG_LEVEL_INFO: priority = ANDROID_LOG_INFO; break;
   case LIBUSB_LOG_LEVEL_DEBUG: priority = ANDROID_LOG_DEBUG; break;
   default: priority = ANDROID_LOG_UNKNOWN;
   }
   __android_log_write(priority, "libusb", str);
#elif defined(_WIN32)
   UNUSED(level);
   OutputDebugStringA(str);
#elif defined(HAVE_SYSLOG)
   int syslog_level;
   switch (level) {
   case LIBUSB_LOG_LEVEL_NONE: return;	/* Impossible, but keeps compiler happy */
   case LIBUSB_LOG_LEVEL_ERROR: syslog_level = LOG_ERR; break;
   case LIBUSB_LOG_LEVEL_WARNING: syslog_level = LOG_WARNING; break;
   case LIBUSB_LOG_LEVEL_INFO: syslog_level = LOG_INFO; break;
   case LIBUSB_LOG_LEVEL_DEBUG: syslog_level = LOG_DEBUG; break;
   default: syslog_level = LOG_INFO;
   }
   syslog(syslog_level, "%s", str);
#else /* All of gcc, Clang, Xcode seem to use #warning */
#warning System logging is not supported on this platform. Logging to stderr will be used instead.
   UNUSED(level);
   fputs(str, stderr);
#endif
#else
   /* Global log handler */
   if (log_handler)
      log_handler(NULL, level, str);
   else
      fputs(str, stderr);
#endif /* USE_SYSTEM_LOGGING_FACILITY */
}

static void log_v(struct libusb_context *ctx, enum libusb_log_level level,
   const char *function, const char *format, va_list args)
{
   const char *prefix;
   char buf[USBI_MAX_LOG_LEN];
   int global_debug, header_len, text_len;
   static int has_debug_header_been_displayed = 0;

#if defined ENABLE_DEBUG_LOGGING
   global_debug = 1;
   UNUSED(ctx);
#else
   enum libusb_log_level ctx_level;
   long default_level_value;

   if (ctx) {
      ctx_level = ctx->debug;
   } else {
      default_level_value = usbi_atomic_load(&default_debug_level);
      ctx_level = default_level_value < 0 ? get_env_debug_level() : (enum libusb_log_level)default_level_value;
   }

   if (ctx_level < level)
      return;

   global_debug = (ctx_level == LIBUSB_LOG_LEVEL_DEBUG);
#endif

   switch (level) {
   case LIBUSB_LOG_LEVEL_NONE:	/* Impossible, but keeps compiler happy */
      return;
   case LIBUSB_LOG_LEVEL_ERROR:
      prefix = "error";
      break;
   case LIBUSB_LOG_LEVEL_WARNING:
      prefix = "warning";
      break;
   case LIBUSB_LOG_LEVEL_INFO:
      prefix = "info";
      break;
   case LIBUSB_LOG_LEVEL_DEBUG:
      prefix = "debug";
      break;
   default:
      prefix = "unknown";
      break;
   }

   if (global_debug) {
      struct timespec timestamp;

      if (!has_debug_header_been_displayed) {
         has_debug_header_been_displayed = 1;
         log_str(LIBUSB_LOG_LEVEL_DEBUG, "[timestamp] [threadID] facility level [function call] <message>" USBI_LOG_LINE_END);
         log_str(LIBUSB_LOG_LEVEL_DEBUG, "--------------------------------------------------------------------------------" USBI_LOG_LINE_END);
      }

      usbi_get_monotonic_time(&timestamp);
      TIMESPEC_SUB(&timestamp, &timestamp_origin, &timestamp);

      header_len = snprintf(buf, sizeof(buf),
         "[%2ld.%06ld] [%08x] libusb: %s [%s] ",
         (long)timestamp.tv_sec, (long)(timestamp.tv_nsec / 1000L), usbi_get_tid(), prefix, function);
   } else {
      header_len = snprintf(buf, sizeof(buf),
         "libusb: %s [%s] ", prefix, function);
   }

   if (header_len < 0 || header_len >= (int)sizeof(buf)) {
      /* Somehow snprintf() failed to write to the buffer,
       * remove the header so something useful is output. */
      header_len = 0;
   }

   text_len = vsnprintf(buf + header_len, sizeof(buf) - (size_t)header_len,
      format, args);
   if (text_len < 0 || text_len + header_len >= (int)sizeof(buf)) {
      /* Truncated log output. On some platforms a -1 return value means
       * that the output was truncated. */
      text_len = (int)sizeof(buf) - header_len;
   }
   if (header_len + text_len + (int)sizeof(USBI_LOG_LINE_END) >= (int)sizeof(buf)) {
      /* Need to truncate the text slightly to fit on the terminator. */
      text_len -= (header_len + text_len + (int)sizeof(USBI_LOG_LINE_END)) - (int)sizeof(buf);
   }
   strcpy(buf + header_len + text_len, USBI_LOG_LINE_END);

   log_str(level, buf);

   /* Per-context log handler */
#if !defined ENABLE_DEBUG_LOGGING
   if (ctx && ctx->log_handler)
      ctx->log_handler(ctx, level, buf);
#endif
}

void usbi_log(struct libusb_context *ctx, enum libusb_log_level level,
   const char *function, const char *format, ...)
{
   va_list args;

   va_start(args, format);
   log_v(ctx, level, function, format, args);
   va_end(args);
}

#endif /* ENABLE_LOGGING */

/** \ingroup libusb_misc
 * Returns a constant NULL-terminated string with the ASCII name of a libusb
 * error or transfer status code. The caller must not free() the returned
 * string.
 *
 * \param error_code The \ref libusb_error or libusb_transfer_status code to
 * return the name of.
 * \returns The error name, or the string **UNKNOWN** if the value of
 * error_code is not a known error / status code.
 */
DEFAULT_VISIBILITY const char * LIBUSB_CALL libusb_error_name(int error_code)
{
   switch (error_code) {
   case LIBUSB_ERROR_IO:
      return "LIBUSB_ERROR_IO";
   case LIBUSB_ERROR_INVALID_PARAM:
      return "LIBUSB_ERROR_INVALID_PARAM";
   case LIBUSB_ERROR_ACCESS:
      return "LIBUSB_ERROR_ACCESS";
   case LIBUSB_ERROR_NO_DEVICE:
      return "LIBUSB_ERROR_NO_DEVICE";
   case LIBUSB_ERROR_NOT_FOUND:
      return "LIBUSB_ERROR_NOT_FOUND";
   case LIBUSB_ERROR_BUSY:
      return "LIBUSB_ERROR_BUSY";
   case LIBUSB_ERROR_TIMEOUT:
      return "LIBUSB_ERROR_TIMEOUT";
   case LIBUSB_ERROR_OVERFLOW:
      return "LIBUSB_ERROR_OVERFLOW";
   case LIBUSB_ERROR_PIPE:
      return "LIBUSB_ERROR_PIPE";
   case LIBUSB_ERROR_INTERRUPTED:
      return "LIBUSB_ERROR_INTERRUPTED";
   case LIBUSB_ERROR_NO_MEM:
      return "LIBUSB_ERROR_NO_MEM";
   case LIBUSB_ERROR_NOT_SUPPORTED:
      return "LIBUSB_ERROR_NOT_SUPPORTED";
   case LIBUSB_ERROR_OTHER:
      return "LIBUSB_ERROR_OTHER";

   case LIBUSB_TRANSFER_ERROR:
      return "LIBUSB_TRANSFER_ERROR";
   case LIBUSB_TRANSFER_TIMED_OUT:
      return "LIBUSB_TRANSFER_TIMED_OUT";
   case LIBUSB_TRANSFER_CANCELLED:
      return "LIBUSB_TRANSFER_CANCELLED";
   case LIBUSB_TRANSFER_STALL:
      return "LIBUSB_TRANSFER_STALL";
   case LIBUSB_TRANSFER_NO_DEVICE:
      return "LIBUSB_TRANSFER_NO_DEVICE";
   case LIBUSB_TRANSFER_OVERFLOW:
      return "LIBUSB_TRANSFER_OVERFLOW";

   case 0:
      return "LIBUSB_SUCCESS / LIBUSB_TRANSFER_COMPLETED";
   default:
      return "**UNKNOWN**";
   }
}

/** \ingroup libusb_misc
 * Returns a pointer to const struct libusb_version with the version
 * (major, minor, micro, nano and rc) of the running library.
 */
DEFAULT_VISIBILITY
const struct libusb_version * LIBUSB_CALL libusb_get_version(void)
{
   return &libusb_version_internal;
}
